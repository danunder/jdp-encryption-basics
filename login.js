const crypto = require('crypto'); // standard library for encryption/hashing
const fs = require('fs');
const prompt = require('prompt'); // for user input

// destructure our functions
const { scryptSync } = crypto
const { readFileSync } = fs

const users = JSON.parse(readFileSync('./users.txt'))
console.log(`users: ${JSON.stringify(users, null, 2)}`)

// lets get some data and a secret key from the user
prompt.start();
console.log('LOGIN: input user name and secret')
prompt.get(['username', 'secret'], handleInput);

function handleInput(err, result) {
	const { username, secret } = result

	if (err) { return onErr(err); }

	// look for user in the database
    const user = users.find(u => u.username === username)
    if (!user) { return onErr('user not in DB')}
    
    // split saved password into salt and hash
    const [ salt, hash ] = user.password.split(':')
    console.log(`salt: ${salt}`)

	// hash the password with saved salt
	const hashedPassword = scryptSync(secret, salt, 64).toString('base64')
    console.log(`hashedPassword: ${hashedPassword}`)

    // compare new hash with saved hash and validate accordingly
	if (hashedPassword !== hash) {
     return onErr('password incorrect'); 
    }
    console.log(`Welcome back ${username}!!`)
	}

	function onErr(err) {
	console.log(err);
	return 1;
}