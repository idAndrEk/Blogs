import {ObjectId} from "mongodb";

export type UserInputType = {
    login: string;
    password: string;
    email: string;
};

export type UserListResponse = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewType[];
};

// с полем _id
export type UserMongoType = {
    _id: ObjectId;
    login: string;
    password: string;
    email: string;
    createdAt: Date;
};

// с полем id
export type UserViewType = {
    id?: string;
    login: string;
    email: string;
    createdAt: Date;
};