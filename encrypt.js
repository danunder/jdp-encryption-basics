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

	// generate a 24 byte key from the secret
	const key = scryptSync(secret, '', 24) // hashing function
	console.log('Generated key (buffer):')
	console.log(key)

	// generate an 'initiation value' - 16 random bytes, must be sent unencrypted alongside encrypted data
	// adds randomness, ensures messages with same plaintext + same password will have different encrypted values
	const iv = randomBytes(16)
	console.log('Generated iv (buffer):')
	console.log(iv)

	// create cipher and produce encrypted data
	let cipher = createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(data, 'utf8', 'hex')
	encrypted += cipher.final('hex');
	console.log(` ******** \n Encrypted data: ${encrypted} \n ivString: ${iv.toString('hex')} \n ********`);
	}

	function onErr(err) {
	console.log(err);
	return 1;
}