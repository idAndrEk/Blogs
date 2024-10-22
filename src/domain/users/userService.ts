import {ObjectId} from "mongodb";
import {UserInputType, UserMongoType, UserViewType} from "../../types/UserType";
import {usersRepository} from "../../repositories/users/userRepository";

export const usersService = {

    async createUser(userInput: UserInputType): Promise<UserViewType> {
        const newUser = {
            _id: new ObjectId(),
            ...userInput,
            createdAt: new Date(),
        }
     return  await usersRepository.createUser(newUser);

    }
}