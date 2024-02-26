"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const express_validator_1 = require("express-validator");
exports.BlogValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 15, min: 1 })
        .withMessage('Error name'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 500, min: 1 })
        .withMessage('Error description'),
    (0, express_validator_1.body)('websiteUrl')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ max: 100, min: 1 })
        .matches('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
        .withMessage('Error youtubeUrl')
];
