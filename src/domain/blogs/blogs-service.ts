import {BlogInputType, BlogMongoType, BlogViewType} from "../../types/BlogType";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../../repositories/blogs/blogs-repository";

export const blogsService = {

    async createBlog(blogInput: BlogInputType): Promise<BlogViewType> {
        const newBlog: BlogMongoType = {
            _id: new ObjectId(),
            ...blogInput,
            createdAt: new Date(),
            isMembership: false,
        }
        return await blogsRepository.createdBlog(newBlog)

    },

    async updateBlog(id: string, inputUpdateBlog: BlogInputType): Promise<boolean> {
        return await blogsRepository.updateBlog(id, inputUpdateBlog)
    },

    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    },
}