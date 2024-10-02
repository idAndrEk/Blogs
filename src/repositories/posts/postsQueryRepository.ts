import {PostListResponse, PostMongoType, PostViewType} from "../../types/PostType";
import {blogsCollection, postsCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {SortDirection} from "../../types/paginationType";
import {postsRepository} from "./posts-repository";

export const PostsQueryRepository = {
    async findPost(
        page: number,
        pageSize: number,
        title: string | null | undefined,
        sortBy: string,
        sortDirection: string
    ): Promise<PostListResponse> {
        const filter: any = {}
        if (title) {
            filter.name = {$regex: title}
        }
        const skip = (page - 1) * pageSize
        const total = await postsCollection.countDocuments(filter)
        const totalPages = Math.ceil(total / pageSize);
        const sortQuery: any = {};
        if (sortBy) {
            sortQuery[sortBy] = sortDirection === SortDirection.Asc ? 1 : -1;
        }
        const filteredPosts: PostMongoType[] = await postsCollection
            .find(filter)
            .skip(skip)
            .sort(sortQuery)
            .limit(pageSize)
            .toArray()

        const postsListResponse: PostListResponse = {
            pagesCount: totalPages,
            page: page,
            pageSize: pageSize,
            totalCount: total,
            items:
                filteredPosts.map(post => ({
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                })),
        }
        return postsListResponse
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
                blogName: post.blogName,
                createdAt: post.createdAt,
            }
        } else {
            return null
        }
    },

    async findPostBlogById(
        blogId: string | null,
        page: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string
    ): Promise<PostListResponse> {
        const filter: any = {}
        if (blogId) {
            filter.blogId = blogId
        }
        const skip = (page - 1) * pageSize
        const total = await postsCollection.countDocuments(filter)
        const totalPages = Math.ceil(total / pageSize);
        const sortQuery: any = {};
        if (sortBy) {
            sortQuery[sortBy] = sortDirection === SortDirection.Asc ? 1 : -1;
        }
        const filteredPostsByBlogs: PostMongoType[] = await postsCollection
            .find(filter)
            .skip(skip)
            .sort(sortQuery)
            .limit(pageSize)
            .toArray()
        const postsByBlogsListResponse: PostListResponse = {
            pagesCount: totalPages,
            page: page,
            pageSize: pageSize,
            totalCount: total,
            items:
                filteredPostsByBlogs.map(post => ({
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                })),
        }
        return postsByBlogsListResponse
    }
}