import {BlogInputType, BlogListResponse, BlogMongoType, BlogViewType} from "../types/BlogType";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/blogs/blogs-repository";
import {BlogsQueryRepository} from "../repositories/blogs/blogsQueryRepository";

export const blogsService = {
    // async findBlog(parsedPageNumber: number, parsedPageSize: number, searchNameTerm: string | null | undefined): Promise<BlogViewType[]> {
    //     return BlogsQueryRepository.findBlog(parsedPageNumber, parsedPageSize, searchNameTerm)
    // },
    //
    // async findBlogById(id: string): Promise<BlogViewType | null> {
    //     return BlogsQueryRepository.findBlogById(id);
    // },

    async createBlog(blogInput: BlogInputType): Promise<BlogViewType> {
        const newBlog: BlogMongoType = {
            _id: new ObjectId(),
            ...blogInput,
            createdAt: new Date(),
            isMembership: false,
        }
        const createdNewBlog = await blogsRepository.createdBlog(newBlog)
        return createdNewBlog
    },

    async updateBlog(id: string, inputUpdateBlog: BlogInputType): Promise<boolean> {
        return await blogsRepository.updateBlog(id, inputUpdateBlog)
    },

    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    },
}