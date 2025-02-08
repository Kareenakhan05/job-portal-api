const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Token Generation
const generate_token = (payload) => {
    return jwt.sign(payload, "secret_key", { expiresIn: "1d" });
};

// Password Hashing
const hash_password = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Password Comparison
const compare_password = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { generate_token, hash_password, compare_password };
