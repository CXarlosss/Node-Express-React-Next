import { body } from 'express-validator';

export const createCommentValidator = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('El comentario no puede estar vacío')
    .isLength({ min: 2, max: 1000 })
    .withMessage('Debe tener entre 2 y 1000 caracteres'),
];
