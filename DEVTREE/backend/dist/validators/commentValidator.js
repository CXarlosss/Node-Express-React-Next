"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createCommentValidator = [
    (0, express_validator_1.body)('text')
        .trim()
        .notEmpty()
        .withMessage('El comentario no puede estar vacío')
        .isLength({ min: 2, max: 1000 })
        .withMessage('Debe tener entre 2 y 1000 caracteres'),
];
