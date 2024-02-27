import {ObjectId} from "mongodb";

export type PostInputType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    // blogName: string
}

// с полем id
export type PostViewType = {
    id?: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

// с полем _id
export type PostMongoType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

