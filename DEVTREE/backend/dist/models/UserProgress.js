"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userProgressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    node: { type: mongoose_1.Types.ObjectId, ref: 'Node', required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('UserProgress', userProgressSchema);
