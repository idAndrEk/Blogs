import {blogsCollection} from "../db/db";
import {BlogInputType, BlogMongoType, BlogViewType} from "../types/BlogType";
import {ObjectId} from "mongodb";


export const blogsRepository = {
    async findBlog(name: string | null | undefined): Promise<BlogViewType[]> {
        const filter: any = {}
        if (name) {
            filter.name = {$regex: name}
            // console.log('Filter:', filter);
        }
        const filteredBlogs: BlogMongoType[] = await blogsCollection.find(filter).toArray();

        const blogsWithId: BlogViewType[] = filteredBlogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
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
            };
        } else {
            return null;
        }
    },

    async createBlog({name, description, websiteUrl}: BlogInputType): Promise<BlogViewType> {
        const newBlog: BlogMongoType = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        const result = await blogsCollection.insertOne(newBlog)
        return {
            id: result.insertedId.toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
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
    }
}