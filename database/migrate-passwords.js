
const db = require('../src/config/db');
const {
    hashPassword,
    isPasswordHash
} = require('../src/utils/password.util');

async function migratePasswords() {
    let migrated = 0;
    let skipped = 0;

    try {
        const [users] = await db.query(
            'SELECT id, password FROM `user`'
        );

        console.log(`Usuarios encontrados: ${users.length}`);

        for (const user of users) {
            if (isPasswordHash(user.password)) {
                skipped++;
                continue;
            }

            const hashedPassword = await hashPassword(user.password);

            await db.query(
                'UPDATE `user` SET password = ? WHERE id = ?',
                [hashedPassword, user.id]
            );

            migrated++;
        }

        console.log(`Contraseñas migradas: ${migrated}`);
        console.log(`Contraseñas ya protegidas: ${skipped}`);
        console.log('Migración finalizada.');
    } catch (error) {
        console.error('Error durante la migración:', error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

migratePasswords();
