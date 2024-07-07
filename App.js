const express = require('express');
const app = express();
const PORT = 3000;
const { db, doc, getDoc, updateDoc, collection, getDocs } = require('./firebaseConfig');

app.use(express.json());

// Rota para obter dados do usuário pelo docId
app.post('/getUserData', async (req, res) => {
    const { docId } = req.body;
    try {
        const userDocRef = doc(db, 'USERS', docId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).send('User not found');
        }

        const userData = userDoc.data();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Rota para atualizar a valorização da moeda para um único usuário
app.post('/valorizacaoUmUser', async (req, res) => {
    const { docId, percent } = req.body;
    try {
        const userDocRef = doc(db, 'USERS', docId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).send('User not found');
        }

        const userData = userDoc.data();
        const currentCoinValue = userData.COIN_VALUE_ATUAL;
        const newCoinValue = currentCoinValue + (currentCoinValue * (percent / 100));

        await updateDoc(userDocRef, { COIN_VALUE_ATUAL: newCoinValue });

        res.status(200).json({ message: 'Coin value updated successfully', newCoinValue });
    } catch (error) {
        console.error('Error updating coin value:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Rota para atualizar a valorização da moeda para todos os usuários
app.post('/valorizacaoAllUsers', async (req, res) => {
    const { percent } = req.body;
    try {
        const usersCollectionRef = collection(db, 'USERS');
        const usersSnapshot = await getDocs(usersCollectionRef);
        
        const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            const currentCoinValue = userData.COIN_VALUE_ATUAL;
            const newCoinValue = currentCoinValue + (currentCoinValue * (percent / 100));
            const userDocRef = doc(db, 'USERS', userDoc.id);
            return updateDoc(userDocRef, { COIN_VALUE_ATUAL: newCoinValue });
        });

        await Promise.all(updatePromises);
        res.status(200).json({ message: 'Coin value updated successfully for all users' });
    } catch (error) {
        console.error('Error updating coin value for all users:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`App running at port ${PORT}`);
});
