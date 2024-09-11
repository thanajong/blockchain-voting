const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const app = express();
const port = 3000;

// Replace with your contract address and ABI
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const CONTRACT_ABI = [/* ABI from the compiled contract */];

const provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Replace with your Ethereum provider
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider.getSigner());

app.use(bodyParser.json());

app.get('/candidates', async (req, res) => {
    try {
        const candidates = await contract.getCandidates();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/vote', async (req, res) => {
    try {
        const { candidate } = req.body;
        const tx = await contract.vote(candidate);
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/winner', async (req, res) => {
    try {
        const winner = await contract.getWinner();
        res.json({ winner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
