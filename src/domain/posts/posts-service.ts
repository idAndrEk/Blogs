import {ObjectId} from "mongodb";
import {PostsQueryRepository} from "../../repositories/posts/postsQueryRepository";
import {postsRepository} from "../../repositories/posts/posts-repository";
import {PostInputType, PostListResponse, PostMongoType, PostViewType} from "../../types/PostType";


export const postsService = {
    // async findPost(title: string | null | undefined): Promise<PostViewType[]> {
    //     return PostsQueryRepository.findPost(title)
    // },
    //
    // async findPostById(id: string): Promise<PostViewType | null> {
    //     return PostsQueryRepository.findPostById(id)
    // },

    async createPost(id: string, blogName: string, postInput: PostInputType): Promise<PostViewType | null> {
        const newPost: PostMongoType = {
            _id: new ObjectId(),
            ...postInput,
            blogId: id,
            blogName: blogName,
            createdAt: new Date(),
        }
        const createdNewPost = await postsRepository.createPost(newPost)
        return createdNewPost
    },

    async updatePost(id: string, blogName: string, inputUpdatePost: PostInputType): Promise<boolean | null> {
        return await postsRepository.updatePost(id, blogName, inputUpdatePost)
    },

    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
}