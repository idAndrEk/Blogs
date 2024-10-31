import {ObjectId} from "mongodb";
import {UserInputType, UserViewType} from "../../types/UserType";
import {usersRepository} from "../../repositories/users/userRepository";
import {authService} from "../auth/authService";

export const usersService = {

    async createUser(userInput: UserInputType): Promise<UserViewType> {
        const passwordHash = await authService.passwordToSave(userInput.password)
        // console.log(passwordHash)
        const {password, ...hashPasUserInput} = userInput;
        const newUser = {
            _id: new ObjectId(),
            password: passwordHash,
            ...hashPasUserInput,
            createdAt: new Date(),
        }
        return await usersRepository.createUser(newUser);
    },

    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
}