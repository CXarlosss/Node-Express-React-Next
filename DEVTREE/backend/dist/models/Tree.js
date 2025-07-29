"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// In your models/Tree.ts (or Tree.js)
const mongoose_1 = require("mongoose");
const treeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    nodes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Node' }],
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
}, {
    timestamps: true // ✅ Make sure this is present to track createdAt and updatedAt
});
exports.default = (0, mongoose_1.model)('Tree', treeSchema);
