"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errResult = errors.array().map((error) => ({
            message: error.msg,
            field: error.param || error.location || "unknown"
        }));
        res.status(400).json({ codeResult: 1, messages: errResult });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
