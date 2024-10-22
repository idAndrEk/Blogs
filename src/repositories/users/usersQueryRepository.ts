import {blogsCollection, usersCollection} from "../../db/db";
import {UserListResponse, UserMongoType} from "../../types/UserType";
import {SortDirection} from "../../utils/queryParamsParser";
import {BlogMongoType} from "../../types/BlogType";
import {ObjectId} from "mongodb";

export const UsersQueryRepository = {
    async findUsers(sortBy: string,
                    sortDirection: string,
                    page: number,
                    pageSize: number,
                    login: string,
                    email: string): Promise<UserListResponse> {
        const filter: any = {}
        if (login) {
            filter.login = {$regex: login, $options: 'i'}
        }
        if (email) {
            filter.email = {$regex: email, $options: 'i'}
        }
        const skip = (page - 1) * pageSize
        const total = await usersCollection.countDocuments(filter)
        const totalPages = Math.ceil(total / pageSize);
        const sortQuery: any = {};
        if (sortBy) {
            sortQuery[sortBy] = sortDirection === SortDirection.Asc ? 1 : -1;
        }
        let filteredUsers = await usersCollection.find(filter)
            .skip(skip)
            .sort(sortQuery)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount: totalPages,
            page: page,
            pageSize: pageSize,
            totalCount: total,
            items: filteredUsers.map(u => ({
                id: u._id.toString(),
                login: u.login,
                email: u.email,
                createdAt: u.createdAt,
            })),
        }
    },

    async findUserByLogin(login: string): Promise<boolean> {
        console.log('findUserByLogin: ', login)
        const user = await usersCollection.findOne({login});
        return !!user
    },

    async findUserByEmail(email: string): Promise<boolean> {
        const user = await usersCollection.findOne({email});
        return !!user
    }

}