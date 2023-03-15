// decrypt.js
const crypto = require('crypto'); // standard library for encryption/hashing
const prompt = require('prompt'); // for user input

// destructure our functions
const { createDecipheriv, scryptSync } = crypto
// we'll need to tell crypto what encryption algorithm we want to use
const algorithm = 'aes-192-cbc';

// input encryptedData, iv and password
prompt.start();
prompt.get(['encryptedData', 'ivString', 'secret'], handleInput);

function handleInput(err, result) {
    const { encryptedData, ivString, secret } = result

	if (err) { return onErr(err); }

	console.log(`Data to decrypt: ${encryptedData}`);

	// generate a 24 byte key from the secret
	const key = scryptSync(secret, '', 24)
	console.log('Generated key: ' + key.toString('hex'));

    // convert string iv back to buffer
    const iv = Buffer.from(ivString, 'hex')
    console.log('iv (as buffer):')
    console.log(iv)

    // create cypher and decrypt data
	let cipher = createDecipheriv(algorithm, key, iv);
	let decrypted = cipher.update(encryptedData, 'hex', 'utf8')
	decrypted += cipher.final('utf8');
    
	console.log(` ******** \n Decrypted data: ${decrypted} \n ********`);
	}
	function onErr(err) {
	console.log(err);
	return 1;
}