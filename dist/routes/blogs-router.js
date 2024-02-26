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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const Blog_validation_1 = require("../midlewares/Blog-validation");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const foundBlogs = yield blogs_db_repository_1.blogsRepository.findBlog((_a = req.query.name) === null || _a === void 0 ? void 0 : _a.toString());
        res.status(200).send(foundBlogs);
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let blog = yield blogs_db_repository_1.blogsRepository.findBlogById(req.params.id);
        if (blog) {
            res.send(blog);
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
exports.blogsRouter.post('/', auth_middleware_1.authBasicMiddleware, Blog_validation_1.BlogValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, websiteUrl } = req.body;
        const newBlog = yield blogs_db_repository_1.blogsRepository.createBlog({ name, description, websiteUrl });
        res.status(201).send(newBlog);
    }
    catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.blogsRouter.put('/:id', auth_middleware_1.authBasicMiddleware, Blog_validation_1.BlogValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, websiteUrl } = req.body;
        const isUpdated = yield blogs_db_repository_1.blogsRepository.updateBlog(req.params.id, { name, description, websiteUrl });
        if (isUpdated) {
            const blog = yield blogs_db_repository_1.blogsRepository.findBlogById(req.params.id);
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
exports.blogsRouter.delete('/:id', auth_middleware_1.authBasicMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield blogs_db_repository_1.blogsRepository.deleteBlog(req.params.id);
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
