// hash.js
const crypto = require('crypto'); // standard library for encryption/hashing
const fs = require('fs');
const prompt = require('prompt'); // for user input

// destructure our functions
const { randomBytes, scryptSync } = crypto
const { readFileSync, writeFileSync } = fs

const users = JSON.parse(readFileSync('./users.txt'))
console.log(`users: ${JSON.stringify(users, null, 2)}`)

// lets get some data and a secret key from the user
prompt.start();
console.log('SIGNUP: create user name and secret')
prompt.get(['username', 'secret'], handleInput);

function handleInput(err, result) {
	const { username, secret } = result

	if (err) { return onErr(err); }

	// generate a salt to add to our hash
    const salt = randomBytes(16).toString('base64')
    console.log(`salt: ${salt}`)

	// hash the password
	const hashedPassword = scryptSync(secret, salt, 64).toString('base64')
    console.log(`hashedPassword: ${hashedPassword}`)

    // combine salt + hashed password and store in DB with username
	users.push({ username, password: salt + ':' + hashedPassword})
    console.log(`users: ${JSON.stringify(users, null, 2)}`)

	writeFileSync('./users.txt', JSON.stringify(users))
	}

	function onErr(err) {
	console.log(err);
	return 1;
}
