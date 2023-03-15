const crypto = require('crypto'); // standard library for encryption/hashing
const prompt = require('prompt'); // for user input


const { createDecipheriv, scryptSync } = crypto
// we'll need to tell crypto what encryption algorithm we want to use
const algorithm = 'aes-192-cbc';

// input data, iv and password
prompt.start();
prompt.get(['encryptedData', 'iv', 'secret'], handleInput);

function handleInput(err, result) {
	if (err) { return onErr(err); }
	console.log('Data to decrypt: ' + result.encryptedData);

	// generate an appropriate key from the secret
	const key = scryptSync(result.secret, '', 24)
	console.log('Generated key: ' + key.toString('hex'));

	// transform our string form iv back into a buffer
	const iv = Buffer.from(result.iv, 'hex');

	let cipher = createDecipheriv(algorithm, key, iv);
	let decrypted = cipher.update(result.encryptedData, 'hex', 'utf8')
	decrypted += cipher.final('utf8');
	console.log('Decrypted data: ' + decrypted);
	}
	function onErr(err) {
	console.log(err);
	return 1;
}