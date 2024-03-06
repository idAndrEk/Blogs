import {ObjectId} from "mongodb";

export type BlogInputType = {
    name: string;
    description: string;
    websiteUrl: string;
};

// с полем _id
export type BlogMongoType = {
    _id: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};

// с полем id
export type BlogViewType = {
    id?: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};