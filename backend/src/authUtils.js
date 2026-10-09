const crypto = require('crypto');

function verifyIdentityV3Password(hashedPassword, password) {
    try {
        const buf = Buffer.from(hashedPassword, 'base64');

        if (buf[0] !== 0x01) {
            return false;
        }

        const prf = buf.readUInt32BE(1);
        const iterations = buf.readUInt32BE(5);
        const saltLength = buf.readUInt32BE(9);

        const salt = buf.slice(13, 13 + saltLength);
        const expectedSubkey = buf.slice(13 + saltLength);

        let algorithm;

        switch (prf) {
            case 0:
                algorithm = 'sha1';
                break;
            case 1:
                algorithm = 'sha256';
                break;
            case 2:
                algorithm = 'sha512';
                break;
            default:
                return false;
        }

        const actualSubkey = crypto.pbkdf2Sync(
            password,
            salt,
            iterations,
            expectedSubkey.length,
            algorithm
        );

        return crypto.timingSafeEqual(
            expectedSubkey,
            actualSubkey
        );
    } catch (err) {
        console.error(err);
        return false;
    }
}

function hashIdentityV3Password(password) {
    const salt = crypto.randomBytes(16);

    const prf = 1; // SHA256
    const iterations = 10000;
    const subkeyLength = 32;

    const subkey = crypto.pbkdf2Sync(
        password,
        salt,
        iterations,
        subkeyLength,
        'sha256'
    );

    const output = Buffer.alloc(13 + salt.length + subkey.length);

    output[0] = 0x01; // Identity V3 marker

    output.writeUInt32BE(prf, 1);
    output.writeUInt32BE(iterations, 5);
    output.writeUInt32BE(salt.length, 9);

    salt.copy(output, 13);
    subkey.copy(output, 13 + salt.length);

    return output.toString('base64');
}

module.exports = {
    verifyIdentityV3Password,
    hashIdentityV3Password
};