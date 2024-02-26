import {blogsCollection} from "../db/db";
import {BlogInputType, BlogViewType} from "../types/BlogType";
import {randomUUID} from "crypto";


export const blogsRepository = {
    async findBlog(name: string | null | undefined): Promise<BlogViewType[]> {
        const filter: any = {}
        if (name) {
            filter.name = {$regex: name}
            console.log('Filter:', filter);
        }
        const filteredBlogs: BlogViewType[] = await blogsCollection.find({}).toArray();
        return filteredBlogs;
    },

    async findBlogById(id: string): Promise<BlogViewType | null> {
        let blog: BlogViewType | null = await blogsCollection.findOne({id: id})
        if (blog) {
            return blog
        } else {
            return null
        }
    },

    async createBlog({name, description, websiteUrl}: BlogInputType): Promise<BlogViewType> {
        const newBlog = {
            id: randomUUID(),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        const result = await blogsCollection.insertOne(newBlog)
        return newBlog
    },

    async updateBlog(id: string, {name, description, websiteUrl}: BlogInputType): Promise<boolean> {
        const result = await blogsCollection.updateOne({id: id}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}