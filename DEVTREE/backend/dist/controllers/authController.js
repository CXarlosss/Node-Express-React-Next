"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User")); // Importa IUser para el tipado
const generateToken_1 = require("../utils/generateToken");
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const newUser = await User_1.default.create({ name, email, password });
        // 🔥 CORRECCIÓN: Explicitamente casteamos newUser a mongoose.HydratedDocument<IUser>
        const user = newUser;
        res.status(201).json({
            // 🔥 CORRECCIÓN FINAL: Casteamos user._id a mongoose.Types.ObjectId
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: (0, generateToken_1.generateToken)(user._id.toString()),
        });
    }
    catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User_1.default.findOne({ email });
        // 🔥 CORRECCIÓN: Explicitamente casteamos foundUser a mongoose.HydratedDocument<IUser>
        const user = foundUser;
        // Verificamos si el usuario existe y si la contraseña es correcta
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        res.json({
            // 🔥 CORRECCIÓN FINAL: Casteamos user._id a mongoose.Types.ObjectId
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: (0, generateToken_1.generateToken)(user._id.toString()),
        });
    }
    catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};
exports.loginUser = loginUser;
