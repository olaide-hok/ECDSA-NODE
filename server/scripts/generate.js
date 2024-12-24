const {secp256k1} = require('ethereum-cryptography/secp256k1.js');
const {bls12_381: bls} = require('ethereum-cryptography/bls.js');
const {toHex} = require('ethereum-cryptography/utils.js');
const {keccak256} = require('ethereum-cryptography/keccak.js');

const privateKey = bls.utils.randomPrivateKey();

console.log('private key', toHex(privateKey));

const publicKey = bls.getPublicKey(privateKey);
console.log('public key', toHex(publicKey));

const publicAddress = keccak256(publicKey.slice(1)).slice(-20); // like ethereum
console.log('public key address', toHex(publicAddress));
