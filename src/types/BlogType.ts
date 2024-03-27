import {ObjectId} from "mongodb";

export type BlogInputType = {
    name: string;
    description: string;
    websiteUrl: string;
};

export type BlogListResponse = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogViewType[];
};

// с полем _id
export type BlogMongoType = BlogInputType & {
    _id: ObjectId;
    createdAt: Date;
    isMembership: boolean;
};

// с полем id
export type BlogViewType = BlogInputType & {
    id?: string;
    createdAt: Date;
    isMembership: boolean;
};