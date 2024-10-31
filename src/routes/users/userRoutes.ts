import {Request, Response, Router} from "express";
import {UserListResponse, UserViewType} from "../../types/UserType";
import {UsersQueryRepository} from "../../repositories/users/usersQueryRepository";
import {parseQueryParams} from "../../utils/queryParamsParser";
import {authBasicMiddleware} from "../../midlewares/auth/authMiddleware";
import {usersService} from "../../domain/users/userService";
import {UserValidation} from "../../validators/userValidator";
import {inputValidationMiddleware, validateObjectIdMiddleware} from "../../midlewares/input-validation-middleware";

export const usersRouter = Router({})

// errors
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

usersRouter.get('/',
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            // const sortBy: SortBy = req.query.sortBy as SortBy || SortBy.CreatedAt;
            // const sortDirection: SortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc;
            // const parsedPageNumber = req.query.pageNumber || 1;
            // const parsedPageSize = req.query.pageSize || 10;

            const {sortBy, sortDirection, parsedPageNumber, parsedPageSize} = parseQueryParams(req)
            // console.log(parseQueryParams(req))
            const searchLoginTerm = req.query.searchLoginTerm || ''
            const searchEmailTerm = req.query.searchEmailTerm || ''
            const usersListResponse: UserListResponse = await UsersQueryRepository.findUsers(
                sortBy.toString(),
                sortDirection,
                +parsedPageNumber,
                +parsedPageSize,
                searchLoginTerm.toString(),
                searchEmailTerm.toString(),
            )
            return res.status(200).send(usersListResponse)
        } catch (error) {
            return handleErrors(res, error);
        }
    })


usersRouter.post('/',
    authBasicMiddleware,
    UserValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {login, password, email} = req.body
            const newUser: UserViewType = await usersService.createUser({login, password, email})
            return res.status(201).send(newUser)
        } catch (error) {
            return handleErrors(res, error);
        }
    })


usersRouter.delete('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            const deleteUserById = await usersService.deleteUser(req.params.id)
            if (deleteUserById) {
                return res.sendStatus(204)
            }
            return res.sendStatus(404)
        } catch (error) {
            return handleErrors(res, error);
        }
    })

