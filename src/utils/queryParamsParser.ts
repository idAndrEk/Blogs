import {Request} from "express";

export const parseQueryParams = (req: Request) => {
    const parsedPageNumber = parseInt(req.query.pageNumber as string) || 1;
    const parsedPageSize = parseInt(req.query.pageSize as string) || 10;
    const sortBy = req.query.sortBy || 'createdAt'
    // const sortBy: SortBy = req.query.sortBy as SortBy || SortBy.CreatedAt;
    const sortDirection: SortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc

    return {
        parsedPageNumber,
        parsedPageSize,
        sortBy,
        sortDirection,
    };
};
export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc'
}

// enum SortBy {
//     Name = 'name',
//     CreatedAt = 'createdAt'
// }