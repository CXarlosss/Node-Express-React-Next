"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.post('/favorites/:nodeId', authMiddleware_1.protect, async (req, res) => {
    const { nodeId } = req.params;
    const user = req.user;
    if (!user.favorites.includes(nodeId)) {
        user.favorites.push(nodeId);
        await user.save();
    }
    res.json({ message: 'Nodo añadido a favoritos', favorites: user.favorites });
});
router.post('/completed/:nodeId', authMiddleware_1.protect, async (req, res) => {
    const { nodeId } = req.params;
    const user = req.user;
    if (!user.completed.includes(nodeId)) {
        user.completed.push(nodeId);
        await user.save();
    }
    res.json({ message: 'Nodo marcado como completado', completed: user.completed });
});
router.get('/favorites', authMiddleware_1.protect, async (req, res) => {
    const user = await User_1.default.findById(req.user._id).populate('favorites');
    res.json(user?.favorites || []);
});
router.get('/completed', authMiddleware_1.protect, async (req, res) => {
    const user = await User_1.default.findById(req.user._id).populate('completed');
    res.json(user?.completed || []);
});
exports.default = router;
