"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nodes_1 = __importDefault(require("./nodes"));
const auth_1 = __importDefault(require("./auth"));
const trees_1 = __importDefault(require("./trees"));
const userProgress_1 = __importDefault(require("./userProgress"));
const comment_1 = __importDefault(require("./comment"));
const badge_1 = __importDefault(require("./badge"));
const search_1 = __importDefault(require("./search"));
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.send('¡Backend DEVTREE funcionando!');
});
router.use('/api/auth', auth_1.default);
router.use('/api/nodes', nodes_1.default);
router.use('/api/trees', trees_1.default);
router.use('/api/progress', userProgress_1.default);
router.use('/api/comments', comment_1.default);
router.use('/api/badges', badge_1.default);
router.use('/api/search', search_1.default);
exports.default = router;
