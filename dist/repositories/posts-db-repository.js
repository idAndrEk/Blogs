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
exports.postsRepository = void 0;
const db_1 = require("../db/db");
const crypto_1 = require("crypto");
exports.postsRepository = {
    findPost(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (title) {
                filter.name = { $regex: title };
                console.log('Filter:', filter);
            }
            const filteredBlogs = yield db_1.postsCollection.find({}).toArray();
            return filteredBlogs;
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield db_1.postsCollection.findOne({ id: id });
            if (post) {
                return post;
            }
            else {
                return null;
            }
        });
    },
    createPost({ title, shortDescription, content, blogId, blogName }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: (0, crypto_1.randomUUID)(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blogName
            };
            const result = yield db_1.postsCollection.insertOne(newBlog);
            return newBlog;
        });
    },
    updatePost(id, { title, shortDescription, content, blogId, blogName }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.updateOne({ id: id }, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    blogName: blogName
                }
            });
            return result.matchedCount === 1;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
};
