import { client as prisma } from './client';
// Bcrypt 
import { hash } from 'bcryptjs';

/* 
Seeding the database
Documentation: https://www.prisma.io/docs/guides/database/seed-database
*/

async function main() {

    const roles = await prisma.role.createMany({
        data: [
            { name: 'administrator' },
            { name: 'client' }
        ]
    });

    const admin = await prisma.user.createMany({
        data: [
            {
                email: 'admin@gmail.com',
                name: 'Fulano da Silva',
                username: '@fulano',
                password: await hash('12345', 8),
                roleId: 1
            },
            {
                email: 'user_a@gmail.com',
                name: 'User A',
                username: '@user_a',
                password: await hash('12345', 8),
                roleId: 2
            }
        ]
    });

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })