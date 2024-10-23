import {blogsCollection, usersCollection} from "../../db/db";
import {UserMongoType, UserViewType} from "../../types/UserType";
import {ObjectId} from "mongodb";


export const usersRepository = {

    async createUser(newUser: UserMongoType): Promise<UserViewType> {
        const result = await usersCollection.insertOne(newUser)
        const {_id, password, ...userData} = newUser
        return {
            id: _id.toString(),
            ...userData
        }
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
}