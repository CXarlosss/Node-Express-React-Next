"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Badge.ts
const mongoose_1 = require("mongoose");
const badgeSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Badge', badgeSchema);
