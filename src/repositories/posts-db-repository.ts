import {postsCollection} from "../db/db";
import {PostInputType, PostViewType} from "../types/PostType";
import {randomUUID} from "crypto";


export const postsRepository = {
    async findPost(title: string | null | undefined): Promise<PostViewType[]> {
        const filter: any = {}
        if (title) {
            filter.name = {$regex: title}
            console.log('Filter:', filter);
        }
        const filteredBlogs: PostViewType[] = await postsCollection.find({}).toArray();
        return filteredBlogs;
    },

    async findPostById(id: string): Promise<PostViewType | null> {
        let post: PostViewType | null = await postsCollection.findOne({id: id})
        if (post) {
            return post
        } else {

            return null
        }
    },

    async createPost({title, shortDescription, content, blogId,blogName}: PostInputType): Promise<PostViewType> {
        const newBlog = {
            id:randomUUID(),
            title: title,
            shortDescription:shortDescription,
            content:content,
            blogId: blogId,
            blogName:blogName
        }
        const result = await postsCollection.insertOne(newBlog)
        return newBlog
    },

    async updatePost(id: string, {title, shortDescription, content, blogId,blogName}: PostInputType): Promise<boolean> {
        const result = await postsCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription:shortDescription,
                content:content,
                blogId: blogId,
                blogName:blogName
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}