"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const express_validator_1 = require("express-validator");
exports.PostValidation = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 30, min: 1 })
        .withMessage('Error title'),
    (0, express_validator_1.body)('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 100, min: 1 })
        .withMessage('Error shortDescription'),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 1000, min: 1 })
        .withMessage('Error content'),
    (0, express_validator_1.body)('blogId')
        .notEmpty()
        .isString()
        .trim()
        .withMessage('Error blogId')
];
