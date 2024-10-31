import {ObjectId} from "mongodb";
import {PostsQueryRepository} from "../../repositories/posts/postsQueryRepository";
import {postsRepository} from "../../repositories/posts/posts-repository";
import {
    CommentInputType,
    CommentViewType,
    PostInputType,
    PostListResponse,
    PostMongoType,
    PostViewType
} from "../../types/PostType";


export const commentsService = {
    // async findPost(title: string | null | undefined): Promise<PostViewType[]> {
    //     return PostsQueryRepository.findPost(title)
    // },
    //
    // async findPostById(id: string): Promise<PostViewType | null> {
    //     return PostsQueryRepository.findPostById(id)
    // },

    // async createComments( postInput: CommentInputType): Promise<CommentViewType | null> {
    //     const newPost: PostMongoType = {
    //
    //     }
    //    return await postsRepository.createPost(newPost)
    // },
}