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
exports.blogsRepository = void 0;
const db_1 = require("../db/db");
const crypto_1 = require("crypto");
exports.blogsRepository = {
    findBlog(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (name) {
                filter.name = { $regex: name };
                console.log('Filter:', filter);
            }
            const filteredBlogs = yield db_1.blogsCollection.find({}).toArray();
            return filteredBlogs;
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield db_1.blogsCollection.findOne({ id: id });
            if (blog) {
                return blog;
            }
            else {
                return null;
            }
        });
    },
    createBlog({ name, description, websiteUrl }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: (0, crypto_1.randomUUID)(),
                name: name,
                description: description,
                websiteUrl: websiteUrl
            };
            const result = yield db_1.blogsCollection.insertOne(newBlog);
            return newBlog;
        });
    },
    updateBlog(id, { name, description, websiteUrl }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.updateOne({ id: id }, {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl
                }
            });
            return result.matchedCount === 1;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
};
