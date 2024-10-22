import {MongoClient} from "mongodb";
import {BlogViewType} from "../types/BlogType";
import {PostViewType} from "../types/PostType";
import {UserViewType} from "../types/UserType";

require('dotenv').config()

const mongoUri = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

const client = new MongoClient(mongoUri)

const db = client.db("It-incubator")

export const blogsCollection = db.collection<BlogViewType>("blogs");
export const postsCollection = db.collection<PostViewType>("posts");
export const usersCollection = db.collection<UserViewType>("users");


export async function runDb() {
    try {
        await client.connect()
        await client.db().command({ping: 1})
        console.log("Connected successfully to mongo server")
    } catch {
        console.log("Can't connect to db")
        await client.close()
    }
}
