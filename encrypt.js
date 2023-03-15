// encrypt.js
const crypto = require('crypto'); // standard library for encryption/hashing
const prompt = require('prompt'); // for user input

// destructure our functions
const { createCipheriv, randomBytes, scryptSync } = crypto
// we'll need to tell crypto what encryption algorithm we want to use
const algorithm = 'aes-192-cbc';

// lets get some data and a secret key from the user
prompt.start();
prompt.get(['data', 'secret'], handleInput);

function handleInput(err, result) {
	const { data, secret } = result

	if (err) { return onErr(err); }
	console.log('Data to encrypt: ' + data);

	// generate an appropriate key from the secret - 24 bytes long as a 'buffer'
	const key = scryptSync(secret, '', 24)
	console.log('Generated key: ' + key.toString('hex').match(/../g).join(' '));

	// generate an 'initiation value' - 16 random bytes, can be sent unencrypted with cipherText 
	// adds randomness, ensures messages with same plaintext + same password will have different encrypted values
	const iv = randomBytes(16);
	console.log('Generated iv: ' + iv.toString('hex').match(/../g).join(' '));

	let cipher = createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(data, 'utf8', 'hex')
	encrypted += cipher.final('hex');
	console.log('Encrypted data: ' + encrypted);
	}
	function onErr(err) {
	console.log(err);
	return 1;
}