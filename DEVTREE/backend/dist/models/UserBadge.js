"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userBadgeSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    badge: { type: mongoose_1.Types.ObjectId, ref: 'Badge', required: true },
    achievedAt: { type: Date, default: Date.now },
});
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('UserBadge', userBadgeSchema);
