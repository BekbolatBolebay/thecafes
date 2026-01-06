const bcrypt = require('bcrypt');

async function testBcrypt() {
  try {
    const password = '1234Pppp!';
    const hash = '$2b$10$eQak1HISctD23DefTN6rkOyCsGU98k3MBwkA8Uzq2nCrxSLh.G5oC';
    
    console.log('Testing bcrypt password verification...');
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    
    const isValid = await bcrypt.compare(password, hash);
    
    console.log(`\n✅ Password valid: ${isValid}`);
    
    if (isValid) {
      console.log('\n✨ Admin login will work now!');
      console.log('\nLogin credentials:');
      console.log('Email: bolebay.bekbolat.25@gmail.com or nugnurd@gmail.com');
      console.log('Password: 1234Pppp!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testBcrypt();
