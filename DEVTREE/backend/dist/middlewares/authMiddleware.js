"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'defaultsecret');
            req.user = await User_1.default.findById(decoded.userId).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }
            next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Token inválido', error });
        }
    }
    else {
        return res.status(401).json({ message: 'No autorizado, token no encontrado' });
    }
};
exports.protect = protect;
