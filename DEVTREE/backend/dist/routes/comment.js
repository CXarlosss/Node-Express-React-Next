"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const commentValidator_1 = require("../validators/commentValidator");
const Comment_1 = __importDefault(require("../models/Comment"));
const Node_1 = __importDefault(require("../models/Node"));
const Tree_1 = __importDefault(require("../models/Tree"));
const router = (0, express_1.Router)();
// 👉 Crear comentario
router.post('/:nodeId', authMiddleware_1.protect, commentValidator_1.createCommentValidator, validateRequest_1.validateRequest, async (req, res) => {
    try {
        const { nodeId } = req.params;
        const { text } = req.body;
        const node = await Node_1.default.findById(nodeId);
        if (!node)
            return res.status(404).json({ message: 'Nodo no encontrado' });
        const tree = await Tree_1.default.findById(node.tree);
        if (!tree || !tree.isPublic) {
            return res.status(403).json({ message: 'No se puede comentar en este nodo' });
        }
        const comment = await Comment_1.default.create({
            text,
            author: req.user._id,
            node: node._id,
        });
        const populatedComment = await Comment_1.default.findById(comment._id)
            .populate('author', 'name');
        res.status(201).json(populatedComment);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al crear comentario', error: err });
    }
});
// 👉 Obtener comentarios de un nodo
router.get('/:nodeId/comments', async (req, res) => {
    try {
        const comments = await Comment_1.default.find({ node: req.params.nodeId })
            .sort({ createdAt: -1 })
            .populate('author', 'name');
        res.json(comments);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al obtener comentarios', error: err });
    }
});
exports.default = router;
