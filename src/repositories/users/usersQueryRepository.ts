import {usersCollection} from "../../db/db";
import {UserCheckByLogin, UserListResponse, UserMongoType} from "../../types/UserType";
import {SortDirection} from "../../utils/queryParamsParser";



export const UsersQueryRepository = {
    async findUsers(sortBy: string,
                    sortDirection: string,
                    page: number,
                    pageSize: number,
                    login: string,
                    email: string
    ): Promise<UserListResponse> {
        const filter: any = {}
        const orConditions: any[] = [];
        if (login) {
            orConditions.push({ login: { $regex: login, $options: 'i' } })
        }
        if (email) {
            orConditions.push({ email: { $regex: email, $options: 'i' } })
        }
        if (orConditions.length > 0) {
            filter.$or = orConditions
        }
        // console.log('Filter:', filter);
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
        // console.log('filteredUsers: ',filteredUsers)
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
        // console.log('findUserByLogin: ', login)
        const user = await usersCollection.findOne({login});
        console.log(user)
        return !!user
    },

    async findUserByEmail(email: string): Promise<boolean> {
        const user = await usersCollection.findOne({email});
        return !!user
    },

    async findCheckUserByLogin(login: string): Promise<UserCheckByLogin | null> {
        const user = await usersCollection.findOne<UserMongoType>({login});
        if (!user) return null;
        return {
            login: user.login,
            email: user.email,
            passwordHash: user.password,
            id: user._id
        }
    }
}