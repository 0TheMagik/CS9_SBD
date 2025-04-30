const userRepository = require('../repositories/user.repository');
const baseResponse = require('../utils/baseResponse.util');
const bcrypt = require('bcrypt');

const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.query;
    //email
    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format", null);
    }
    //  password
    if (!passwordRegex.test(password)) {
        return baseResponse(res, false, 400, "Password harus minimal 8 characters, setidaknya 1 huruf dan 1 angka", null);
    }
    try {
         // Hash password dengan bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userRepository.createUser({ name, email, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

         // Membandingkan password request dengan password hash di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            payload: user
        });
    } catch (error) {
        console.error("Error logging in user", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUserByEmail = async (req, res) => {
    const email = req.params.email; 
    try {
        const user = await userRepository.getUserByEmail(email);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error retrieving user by email", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateUser = async (req, res) => {
    const { id, name, email, password } = req.body;
    // Pastikan id ada
    if (!id) {
        return baseResponse(res, false, 400, "User id is required", null);
    }
    // Validasi untuk email
    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format", null);
    }
    // Validasi untu kpassword
    if (!passwordRegex.test(password)) {
        return baseResponse(res, false, 400, "Password harus minimal 8 characters, setidaknya 1 huruf dan 1 angka", null);
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await userRepository.updateUser({ id, name, email, password: hashedPassword });
        if (updatedUser) {
            return baseResponse(res, true, 200, "User updated successfully", updatedUser);
        } else {
            return baseResponse(res, false, 404, "User not found", null);
        }
    } catch (error) {
        console.error("Error updating user", error);
        return baseResponse(res, false, 500, error.message || "Internal server error", error);
    }
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedUser = await userRepository.deleteUser(id);
        if (deletedUser) {
            res.status(200).json({
                success: true,
                message: "User deleted",
                payload: deletedUser
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.TopUp = async (req, res) => {
    const { id, balance } = req.query;
    if (!id || !balance) {
        return baseResponse(res, false, 400, "ID and balance are required", null);
    }
    try {
        const updatedUser = await userRepository.TopUp(id, balance);  // balance akan dikirim sebagai amount
        if (updatedUser) {
            return baseResponse(res, true, 200, "User balance updated successfully", updatedUser);
        } else {
            return baseResponse(res, false, 404, "User not found", null);
        }
    } catch (error) {
        console.error("Error updating user balance", error);
        return baseResponse(res, false, 500, error.message || "Internal server error", error);
    }
};