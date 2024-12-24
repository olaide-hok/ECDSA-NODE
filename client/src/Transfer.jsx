import {useState} from 'react';
import {bls12_381 as bls} from 'ethereum-cryptography/bls.js';
import {toHex, utf8ToBytes} from 'ethereum-cryptography/utils.js';
import server from './server';

function Transfer({address, setBalance, privateKey}) {
    const [sendAmount, setSendAmount] = useState('');
    const [recipient, setRecipient] = useState('');

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function transfer(evt) {
        evt.preventDefault();

        const message = utf8ToBytes(
            JSON.stringify({
                address,
                sendAmount,
                recipient,
            })
        );
        const signature = bls.sign(message, privateKey);
        try {
            const {
                data: {balance},
            } = await server.post(`send`, {
                sender: address,
                amount: parseInt(sendAmount),
                recipient,
                message: Array.from(message),
                privateKey,
                signature: Array.from(signature),
            });
            setBalance(balance);
        } catch (ex) {
            alert(ex.response.data.message);
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}></input>
            </label>

            <input type="submit" className="button" value="Transfer" />
        </form>
    );
}

export default Transfer;
