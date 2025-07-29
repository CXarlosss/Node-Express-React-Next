"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Node_1 = __importDefault(require("../models/Node"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Tree_1 = __importDefault(require("../models/Tree"));
const router = (0, express_1.Router)();
// Crear nodo (protegido)
router.post('/', authMiddleware_1.protect, async (req, res) => {
    try {
        const { title, description, type, parent, tags, tree } = req.body;
        if (!tree) {
            return res.status(400).json({ message: 'Falta el campo tree' });
        }
        const newNode = new Node_1.default({
            title,
            description,
            type,
            parent,
            tags,
            tree,
            createdBy: req.user._id,
        });
        await newNode.save();
        // ✅ Este bloque debe ir DENTRO del try, justo después del save
        await Tree_1.default.findByIdAndUpdate(tree, {
            $push: { nodes: newNode._id },
        });
        res.status(201).json(newNode);
    }
    catch (err) {
        res.status(400).json({ message: 'Error al crear nodo', error: err });
    }
});
// Obtener todos los nodos (pública)
router.get('/', async (_req, res) => {
    try {
        const nodes = await Node_1.default.find();
        res.json(nodes);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al obtener nodos', error: err });
    }
});
// Obtener un nodo por ID (pública)
router.get('/:id', async (req, res) => {
    try {
        const node = await Node_1.default.findById(req.params.id)
            .populate('tree')
            .populate('createdBy');
        if (!node)
            return res.status(404).json({ message: 'Nodo no encontrado' });
        res.json(node);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al obtener nodo', error: err });
    }
});
// Eliminar nodo (protegido)
router.delete('/:id', authMiddleware_1.protect, async (req, res) => {
    try {
        const node = await Node_1.default.findById(req.params.id);
        if (!node)
            return res.status(404).json({ message: 'Nodo no encontrado' });
        // Solo el creador o admin puede eliminar
        if (node.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este nodo' });
        }
        await node.deleteOne();
        res.json({ message: 'Nodo eliminado' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al eliminar nodo', error: err });
    }
});
// Obtener todos los nodos de un árbol específico (protegido)
router.get('/tree/:treeId', authMiddleware_1.protect, async (req, res) => {
    try {
        const nodes = await Node_1.default.find({
            tree: req.params.treeId,
            createdBy: req.user._id,
        }).sort({ createdAt: 1 }); // o por parent si usas jerarquía
        res.json(nodes);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al obtener nodos del árbol', error: err });
    }
});
// Editar nodo (protegido)
router.put('/:id', authMiddleware_1.protect, async (req, res) => {
    try {
        const node = await Node_1.default.findById(req.params.id);
        if (!node)
            return res.status(404).json({ message: 'Nodo no encontrado' });
        if (node.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para editar este nodo' });
        }
        node.title = req.body.title;
        node.description = req.body.description;
        node.type = req.body.type;
        node.tags = req.body.tags;
        await node.save();
        res.json(node);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al actualizar el nodo', error: err });
    }
});
exports.default = router;
