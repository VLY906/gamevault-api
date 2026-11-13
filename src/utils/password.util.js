const bcrypt = require('bcrypt');

const DEFAULT_SALT_ROUNDS = 10;
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function getSaltRounds() {
    return Number(process.env.BCRYPT_SALT_ROUNDS) || DEFAULT_SALT_ROUNDS;
}

async function hashPassword(plainPassword) {
    return bcrypt.hash(String(plainPassword), getSaltRounds());
}

function isPasswordHash(value) {
    return BCRYPT_HASH_PATTERN.test(String(value));
}

async function verifyPassword(plainPassword, storedPassword) {
    if (!isPasswordHash(storedPassword)) {
        return false;
    }

    return bcrypt.compare(String(plainPassword), storedPassword);
}

module.exports = { hashPassword, verifyPassword, isPasswordHash };