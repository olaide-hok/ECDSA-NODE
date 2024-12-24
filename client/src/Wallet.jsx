import {bls12_381 as bls} from 'ethereum-cryptography/bls.js';
import {keccak256} from 'ethereum-cryptography/keccak.js';
import {toHex} from 'ethereum-cryptography/utils.js';
import server from './server';

function Wallet({
    address,
    setAddress,
    balance,
    setBalance,
    setPrivateKey,
    privateKey,
}) {
    async function onChange(evt) {
        const address = evt.target.value;
        setAddress(address);
        if (address) {
            const {
                data: {balance},
            } = await server.get(`balance/${address}`);
            setBalance(balance);
        } else {
            setBalance(0);
        }
    }

    async function onChangePK(evt) {
        const privateKey = evt.target.value;
        setPrivateKey(privateKey);
        const publicKey = bls.getPublicKey(privateKey);
        // const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
        const address = toHex(publicKey);
        setAddress(address);
        if (address) {
            const {
                data: {balance},
            } = await server.get(`balance/${address}`);
            setBalance(balance);
        } else {
            setBalance(0);
        }
    }

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>

            <label>
                Wallet Address
                <input
                    placeholder="Type an address, for example: 0x1"
                    value={address}
                    onChange={onChange}></input>
            </label>

            <label>
                Private Key
                <input
                    placeholder="Type in a private key, for example: 0x1"
                    value={privateKey}
                    onChange={onChangePK}></input>
            </label>

            <div className="balance">Balance: {balance}</div>
        </div>
    );
}

export default Wallet;
