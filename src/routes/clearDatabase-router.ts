import {Request, Response, Router} from "express";
import {blogsCollection, postsCollection, usersCollection} from "../db/db";

export const clearDatabaseRouter = Router({})

clearDatabaseRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        try {
            await blogsCollection.deleteMany({});
            console.log('Cleared blogs collection');
            await postsCollection.deleteMany({});
            console.log('Cleared posts collection');
            await usersCollection.deleteMany({});
            console.log('Cleared users collection');
            return res.sendStatus(204)
        } catch (error) {
            console.error("Error clear database:", error);
            return res.status(500).json({error: "Internal Server Error"});
        }
    })