"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const Post_validation_1 = require("../midlewares/Post-validation");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const foundPosts = yield posts_db_repository_1.postsRepository.findPost((_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString());
        res.status(200).send(foundPosts);
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = yield posts_db_repository_1.postsRepository.findPostById(req.params.id);
        if (post) {
            res.send(post);
            return;
        }
        res.sendStatus(404);
        return;
    }
    catch (error) {
        console.error("Error fetching blog by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.postsRouter.post('/', auth_middleware_1.authBasicMiddleware, Post_validation_1.PostValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, shortDescription, content, blogId, blogName } = req.body;
        const newBlog = yield posts_db_repository_1.postsRepository.createPost({ title, shortDescription, content, blogId, blogName });
        res.status(201).send(newBlog);
    }
    catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.postsRouter.put('/:id', auth_middleware_1.authBasicMiddleware, Post_validation_1.PostValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, shortDescription, content, blogId, blogName } = req.body;
        const isUpdated = yield posts_db_repository_1.postsRepository.updatePost(req.params.id, { title, shortDescription, content, blogId, blogName });
        if (isUpdated) {
            const blog = yield posts_db_repository_1.postsRepository.findPostById(req.params.id);
            res.send(blog);
            return;
        }
        res.sendStatus(404);
        return;
    }
    catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.postsRouter.delete('/:id', auth_middleware_1.authBasicMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield posts_db_repository_1.postsRepository.deletePost(req.params.id);
        if (isDeleted) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404);
        return;
    }
    catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
