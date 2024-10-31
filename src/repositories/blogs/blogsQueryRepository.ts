import {BlogListResponse, BlogMongoType, BlogViewType} from "../../types/BlogType";
import {blogsCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {SortDirection} from "../../utils/queryParamsParser";

export const BlogsQueryRepository = {
    async findBlog(page: number,
                   pageSize: number,
                   name: string | null,
                   sortBy: string,
                   sortDirection: string
    ): Promise<BlogListResponse> {
        const filter: any = {}
        if (name) {
            filter.name = {$regex: name, $options: 'i'}
        }
        const skip = (page - 1) * pageSize
        const total = await blogsCollection.countDocuments(filter)
        const totalPages = Math.ceil(total / pageSize);
        const sortQuery: any = {};
        if (sortBy) {
            sortQuery[sortBy] = sortDirection === SortDirection.Asc ? 1 : -1;
        }
        let filteredBlogs = await blogsCollection.find(filter)
            .skip(skip)
            .sort(sortQuery)
            .limit(pageSize)
            .toArray()
        return {
            pagesCount: totalPages,
            page: page,
            pageSize: pageSize,
            totalCount: total,
            items: filteredBlogs.map(b => ({
                id: b._id.toString(),
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt,
                isMembership: b.isMembership,
            })),
        };
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

    async findBlogValidationById(id: string): Promise<boolean> {
        const blog: BlogMongoType | null = await blogsCollection.findOne({_id: new ObjectId(id)});
        return !!blog;
    },
}