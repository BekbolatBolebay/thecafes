#!/usr/bin/env node

const bcrypt = require('bcrypt');

const password = process.argv[2] || '1234Pppp!';

(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log(`\nPassword: "${password}"`);
    console.log(`Bcrypt Hash: "${hash}"\n`);
    console.log('Copy the hash above and paste it in the SQL file.\n');
  } catch (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
})();
