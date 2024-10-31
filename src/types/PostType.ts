import {ObjectId} from "mongodb";

export type PostInputType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type PostListResponse = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewType[];
};

// с полем id
export type PostViewType = {
    id?: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
}

// с полем _id
export type PostMongoType = {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
}

export type CommentInputType = {
    content: string;
    postId: string;
};

export type CommentViewType = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
};

