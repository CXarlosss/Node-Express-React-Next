"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBadges = exports.getUserBadges = void 0;
const UserBadge_1 = __importDefault(require("../models/UserBadge"));
const Badge_1 = __importDefault(require("../models/Badge"));
const getUserBadges = async (req, res) => {
    try {
        const userId = req.params.userId;
        const badges = await UserBadge_1.default.find({ user: userId }).populate('badge');
        res.json(badges);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los logros', error });
    }
};
exports.getUserBadges = getUserBadges;
const getAllBadges = async (_req, res) => {
    try {
        const badges = await Badge_1.default.find();
        res.json(badges);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener logros disponibles', error });
    }
};
exports.getAllBadges = getAllBadges;
