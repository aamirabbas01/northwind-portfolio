const jwt = require("jsonwebtoken");
const { connectDB } = require("../database/db");
const { verifyIdentityV3Password, hashIdentityV3Password } = require("../authUtils");
const { v4: uuidv4 } = require('uuid');

async function loginUser(email, password) {
    const pool = await connectDB();

    const result = await pool.request()
        .input("Email", email)
        .query(`
            SELECT
                Id,
                Email,
                PasswordHash,
                UserName,
                ProfilePicture
            FROM AspNetUsers
            WHERE Email = @Email
        `);

    const user = result.recordset?.[0];

    if (!user || !verifyIdentityV3Password(user.PasswordHash, password)) {
        throw new Error("Invalid credentials");
    }

    const userId = user.Id;
    const userEmail = user.Email;
    const username =
        user.UserName ||
        userEmail.split("@")[0];

    let profilePictureBase64 = null;

    if (user.ProfilePicture) {
        profilePictureBase64 = `data:image/jpeg;base64,${Buffer
            .from(user.ProfilePicture)
            .toString("base64")}`;
    }

    const token = jwt.sign(
        {
            userId,
            email: userEmail,
            username
        },
        process.env.JWT_SECRET || "your_fallback_jwt_secret_key",
        {
            expiresIn: "7d"
        }
    );

    return {
        token,
        username,
        profilePicture: profilePictureBase64,
        message: "Authentication successful"
    };
}

async function registerUser(email, password, firstName, lastName) {
    const pool = await connectDB();

    // Check for existing email
    const existingUser = await pool.request()
        .input("Email", email.toUpperCase())
        .query(`
SELECT Id
FROM AspNetUsers
WHERE NormalizedEmail = @Email
`);

    if (existingUser.recordset.length > 0) {
        throw new Error("Email already registered");
    }

    const username = email.split("@")[0];
    const userId = uuidv4();
    const passwordHash = hashIdentityV3Password(password);

    await pool.request()
        .input("Id", userId)
        .input("UserName", username)
        .input("NormalizedUserName", username.toUpperCase())
        .input("Email", email)
        .input("NormalizedEmail", email.toUpperCase())
        .input("EmailConfirmed", true)
        .input("PasswordHash", passwordHash)
        .input("SecurityStamp", uuidv4())
        .input("ConcurrencyStamp", uuidv4())
        .input("PhoneNumber", null)
        .input("PhoneNumberConfirmed", false)
        .input("TwoFactorEnabled", false)
        .input("LockoutEnd", null)
        .input("LockoutEnabled", true)
        .input("AccessFailedCount", 0)
        .input("FirstName", firstName || "")
        .input("LastName", lastName || "")
        .query(`
INSERT INTO AspNetUsers (
Id,
UserName,
NormalizedUserName,
Email,
NormalizedEmail,
EmailConfirmed,
PasswordHash,
SecurityStamp,
ConcurrencyStamp,
PhoneNumber,
PhoneNumberConfirmed,
TwoFactorEnabled,
LockoutEnd,
LockoutEnabled,
AccessFailedCount,
FirstName,
LastName
)
VALUES (
@Id,
@UserName,
@NormalizedUserName,
@Email,
@NormalizedEmail,
@EmailConfirmed,
@PasswordHash,
@SecurityStamp,
@ConcurrencyStamp,
@PhoneNumber,
@PhoneNumberConfirmed,
@TwoFactorEnabled,
@LockoutEnd,
@LockoutEnabled,
@AccessFailedCount,
@FirstName,
@LastName
)
`);

    return {
        userId,
        username,
        email,
        message: "Registration successful"
    };
}
module.exports = {
    loginUser,
    registerUser
};



/* router.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await connectDB();
        // 1. ADD ProfilePicture TO THE SQL SELECT QUERY
        const result = await pool.request()
            .input('Email', email)
            .query('SELECT Id, Email, PasswordHash, UserName, ProfilePicture FROM AspNetUsers WHERE Email = @Email');

        const user = result.recordset && result.recordset.length > 0 ? result.recordset[0] : null;

        if (!user || !verifyIdentityV3Password(user.PasswordHash, password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        // 4. EMBED THE USERNAME AND PIC INTO THE JWT DATA PAYLOAD
        // ... validation checks succeed, right before token generation ...

        const userId = user.Id || user.id || user.ID;
        const userEmail = user.Email || user.email || user.EMAIL;
        const username = user.UserName || user.Username || user.username || userEmail.split('@')[0];

        // ✅ 1. Keep the base64 conversion out of jwt.sign to prevent size-limit crashes
        let profilePictureBase64 = null;
        if (user.ProfilePicture) {
            profilePictureBase64 = `data:image/jpeg;base64,${Buffer.from(user.ProfilePicture).toString('base64')}`;
        }

        // ✅ 2. Generate a compact token layout containing ONLY light string claims
        const token = jwt.sign(
            {
                userId,
                email: userEmail,
                username: username
            },
            process.env.JWT_SECRET || 'your_fallback_jwt_secret_key',
            { expiresIn: '7d' }
        );

        // ✅ 3. Pass the profile image data separately alongside the token in the JSON response
        return res.status(200).json({
            token,
            username,
            profilePicture: profilePictureBase64,
            message: 'Authentication successful'
        });


        return res.status(200).json({ token, message: 'Authentication successful' });
    } catch (error) {
        console.error('[AUTH CRASH]', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}); */