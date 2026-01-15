const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function update() {
    try {
        const hash = await bcrypt.hash('123456', 10);
        console.log('Generated Hash:', hash);
        
        const [result] = await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, 'admin@ebazer.com']);
        console.log('Update Result:', result);
        
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
update();
