import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Replace with your contract address and ABI
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const CONTRACT_ABI = [/* ABI from the compiled contract */];

function App() {
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [winner, setWinner] = useState('');

    useEffect(() => {
        const init = async () => {
            const prov = new ethers.JsonRpcProvider('http://localhost:8545'); // Replace with your Ethereum provider
            const contr = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov.getSigner());
            setProvider(prov);
            setContract(contr);
        };
        init();
    }, []);

    const fetchCandidates = async () => {
        const candidatesList = await contract.getCandidates();
        setCandidates(candidatesList);
    };

    const vote = async () => {
        await contract.vote(selectedCandidate);
    };

    const getWinner = async () => {
        const winner = await contract.getWinner();
        setWinner(winner);
    };

    return (
        <div>
            <h1>Class Leader Voting</h1>
            <button onClick={fetchCandidates}>Fetch Candidates</button>
            <ul>
                {candidates.map((candidate, index) => (
                    <li key={index}>{candidate}</li>
                ))}
            </ul>
            <input
                type="text"
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                placeholder="Candidate Address"
            />
            <button onClick={vote}>Vote</button>
            <button onClick={getWinner}>Get Winner</button>
            <p>Winner: {winner}</p>
        </div>
    );
}

export default App;
