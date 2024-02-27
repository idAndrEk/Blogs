import {postsCollection} from "../db/db";
import {PostInputType, PostMongoType, PostViewType} from "../types/PostType";
import {randomUUID} from "crypto";
import {ObjectId} from "mongodb";
import {blogsRepository} from "./blogs-db-repository";


export const postsRepository = {
    async findPost(title: string | null | undefined): Promise<PostViewType[]> {
        const filter: any = {}
        if (title) {
            filter.name = {$regex: title}
        }
        const filteredPosts: PostMongoType[] = await postsCollection.find(filter).toArray();

        const postsWithId: PostViewType[] = filteredPosts.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName
        }))
        return postsWithId
    },

    async findPostById(id: string): Promise<PostViewType | null> {
        const post: PostMongoType | null = await postsCollection.findOne({_id: new ObjectId(id)})
        if (post) {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName
            }
        } else {
            return null
        }
    },

    async createPost({title, shortDescription, content, blogId}: PostInputType): Promise<PostViewType> {
        const blogById = await blogsRepository.findBlogById(blogId)
        const newPost: PostMongoType = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogById!.name
        }
        const result = await postsCollection.insertOne(newPost)
        return {
            id: result.insertedId.toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogById!.name
        }
    },

    async updatePost(id: string, {title, shortDescription, content, blogId}: PostInputType): Promise<boolean> {
        const blogById = await blogsRepository.findBlogById(blogId)
        const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blogById!.name
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}