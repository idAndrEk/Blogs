import {blogsCollection} from "../db/db";
import {BlogInputType, BlogMongoType, BlogViewType} from "../types/BlogType";
import {ObjectId} from "mongodb";


export const blogsRepository = {
    async findBlog(name: string | null | undefined): Promise<BlogViewType[]> {
        const filter: any = {}
        if (name) {
            filter.name = {$regex: name}
        }
        const filteredBlogs: BlogMongoType[] = await blogsCollection.find(filter).toArray();

        const blogsWithId = filteredBlogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }));
        return blogsWithId;
    },

    async findBlogById(id: string): Promise<BlogViewType | null> {
        const blog: BlogMongoType | null = await blogsCollection.findOne({_id: new ObjectId(id)});
        if (blog) {
            return {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
            };
        } else {
            return null;
        }
    },

    async createBlog(blogInput: BlogInputType): Promise<BlogViewType> {
        const newBlog: BlogMongoType = {
            _id: new ObjectId(),
            ...blogInput,
            createdAt: new Date(),
            isMembership: false,
        }
        const result = await blogsCollection.insertOne(newBlog)
        const {_id, ...blogData} = newBlog;
        return {
            id: result.insertedId.toString(),
            ...blogData,
        };
    },

    async updateBlog(id: string, {name, description, websiteUrl}: BlogInputType): Promise<boolean> {
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findBlogValidationById(id: string): Promise<boolean> {
        const blog: BlogMongoType | null = await blogsCollection.findOne({_id: new ObjectId(id)});
        return !!blog;
    },
}