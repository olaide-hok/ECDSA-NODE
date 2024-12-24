const express = require('express');
const app = express();
const cors = require('cors');
const {bls12_381: bls} = require('ethereum-cryptography/bls.js');
const {hexToBytes} = require('ethereum-cryptography/utils.js');

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
    b7e61ad731bc27a4f67b3e080412b2b2f6ce8f8ac1f9102e49aa2b0092c1bd7e193440e528da9da348c884202faddb65: 100,
    '9344b109714a1eba1b1d584b02102b9b5a56e5ec9e95f8bb3d1eaea86a971f0cfd30cee3d51f0c9597d3d20b9d0015e1': 50,
    a49754ec66b73ea3cde9cecd0b383f6eaf8069c1b88a8c2ee092ac95d310efaab36e1fc42619b5a0cd6bbb1f76d15bc6: 75,
};

app.get('/balance/:address', (req, res) => {
    const {address} = req.params;
    const balance = balances[address] || 0;
    res.send({balance});
});

app.post('/send', (req, res) => {
    const {sender, recipient, amount, signature, message, privateKey} =
        req.body;

    const useSignature = new Uint8Array(signature);
    const useMessage = new Uint8Array(message);
    const publicKey = bls.getPublicKey(privateKey);
    // const publicKey = hexToBytes(sender); // This is valid as the above. Used when the sender's public key is provided.

    const isValid = bls.verify(useSignature, useMessage, publicKey);

    if (isValid) {
        setInitialBalance(sender);
        setInitialBalance(recipient);

        if (balances[sender] < amount) {
            res.status(400).send({message: 'Not enough funds!'});
        } else {
            balances[sender] -= amount;
            balances[recipient] += amount;
            res.send({balance: balances[sender]});
        }
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
