"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nodeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Node' },
    tags: [{ type: String }],
    children: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Node' }],
    type: { type: String, enum: ['idea', 'recurso', 'skill'], required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    tree: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tree', required: true }, // 👈 AÑADE ESTO
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Node', nodeSchema);
