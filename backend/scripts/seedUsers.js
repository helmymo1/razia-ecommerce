const db = require('../config/db');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        console.log('Starting user seeding...');

        const users = [
            {
                name: 'Admin User',
                email: 'admin@ebazer.com',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'customer'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'customer'
            },
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                password: 'password123',
                role: 'customer'
            },
            {
                name: 'Bob Brown',
                email: 'bob@example.com',
                password: 'password123',
                role: 'customer'
            },
            {
                name: 'Charlie Davis',
                email: 'charlie@example.com',
                password: 'password123',
                role: 'customer'
            }
        ];

        for (const user of users) {
            // Check if user exists
            const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [user.email]);
            
            if (existing.length === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);

                await db.query(
                    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                    [user.name, user.email, hashedPassword, user.role]
                );
                console.log(`Created user: ${user.name} (${user.role})`);
            } else {
                console.log(`User already exists: ${user.name}`);
            }
        }

        console.log('User seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
