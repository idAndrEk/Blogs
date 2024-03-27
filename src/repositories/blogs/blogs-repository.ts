import {blogsCollection} from "../../db/db";
import {BlogInputType, BlogMongoType, BlogViewType} from "../../types/BlogType";
import {ObjectId} from "mongodb";


export const blogsRepository = {

    async createdBlog(newBlog: BlogMongoType): Promise<BlogViewType> {
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

}