import {BlogListResponse, BlogMongoType, BlogViewType} from "../../types/BlogType";
import {blogsCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {SortDirection} from "../../types/paginationType";

export const BlogsQueryRepository = {
    async findBlog(page: number, pageSize: number, name: string | null, sortBy: string, sortDirection: string): Promise<BlogListResponse[]> {
        // Инициализируем фильтр для запроса
        const filter: any = {}
        // Если задано имя, добавляем его в фильтр
        if (name) {
            filter.name = {$regex: name}
        }
        // Вычисляем количество документов, которые нужно пропустить (для пагинации)
        const skip = (page - 1) * pageSize
        // Вычисляем количество документов в коллекции, соответствующих фильтру
        const total = await blogsCollection.countDocuments(filter)
        // Вычисляем общее количество страниц
        const totalPages = Math.ceil(total / pageSize);
        // Инициализируем объект для сортировки
        const sortQuery: any = {};
        // Если задано поле для сортировки, добавляем его в объект сортировки
        if (sortBy) {
            sortQuery[sortBy] = sortDirection === SortDirection.Asc ? 1 : -1;
        }
        // Выполняем запрос к коллекции с использованием фильтра, сортировки и ограничения по количеству результатов
        let filteredBlogs = await blogsCollection.find(filter)
            .skip(skip)
            .sort(sortQuery)
            .limit(pageSize)
            .toArray()

        const blogsListResponse: BlogListResponse = {
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
        return [blogsListResponse];
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