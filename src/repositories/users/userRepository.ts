import {usersCollection} from "../../db/db";
import {UserMongoType, UserViewType} from "../../types/UserType";


export const usersRepository = {

    async createUser(newUser: UserMongoType): Promise<UserViewType> {
        const result = await usersCollection.insertOne(newUser)
        const {_id, password, ...userData} = newUser
        return {
            id: _id.toString(),
            ...userData
        }
    },
}