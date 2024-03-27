import {postsCollection} from "../../db/db";
import {PostInputType, PostListResponse, PostMongoType, PostViewType} from "../../types/PostType";
import {randomUUID} from "crypto";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../blogs/blogs-repository";


export const postsRepository = {

    async createPost(newPost: PostMongoType): Promise<PostViewType | null> {
        const result = await postsCollection.insertOne(newPost)
        const {_id, ...postData} = newPost;
        return {
            id: result.insertedId.toString(),
            ...postData
        };
    },

    async updatePost(id: string, blogName: string, {
        title,
        shortDescription,
        content,
        blogId
    }: PostInputType): Promise<boolean | null> {
        const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blogName
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

}