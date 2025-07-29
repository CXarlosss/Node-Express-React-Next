"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndAssignBadges = void 0;
const UserProgress_1 = __importDefault(require("../models/UserProgress"));
const UserBadge_1 = __importDefault(require("../models/UserBadge"));
const Badge_1 = __importDefault(require("../models/Badge"));
const checkAndAssignBadges = async (userId) => {
    const userProgress = await UserProgress_1.default.find({ user: userId });
    const completedNodes = userProgress.filter(p => p.completed).length;
    const badgeConditions = [
        { code: 'first_steps', condition: completedNodes >= 1 },
        { code: 'tree_climber', condition: completedNodes >= 10 },
    ];
    for (const { code, condition } of badgeConditions) {
        if (!condition)
            continue;
        const badge = await Badge_1.default.findOne({ code });
        if (!badge)
            continue;
        const alreadyHas = await UserBadge_1.default.findOne({ user: userId, badge: badge._id });
        if (!alreadyHas) {
            await UserBadge_1.default.create({ user: userId, badge: badge._id });
            console.log(`🎖️ Logro asignado a ${userId}: ${badge.title}`);
        }
    }
};
exports.checkAndAssignBadges = checkAndAssignBadges;
