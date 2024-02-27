import {NextFunction, Request, Response} from "express";
import {validationResult,ValidationError} from "express-validator";

const validateObjectIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    const {id} = req.params;

    if (!objectIdPattern.test(id)) {
        // console.error("Invalid ObjectId format");
        res.sendStatus(400);
        return;
    }
    next();
};

export default validateObjectIdMiddleware;

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errResult = errors.mapped();

        const formattedErrors = Object.keys(errResult).map((key) => ({
            message: errResult[key].msg,
            field: key,
        }));

        res.status(400).json({ errorsMessages: formattedErrors });
    } else {
        next();
    }
};

// export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//
//     if (!errors.isEmpty()) {
//         const errResult = errors.array().map((error: ValidationError & {
//             param?: string,
//             location?: string
//         }) => ({
//             message: error.msg,
//             field: error.param || error.location || "unknown"
//         }));
//         res.status(400).json({errorsMessages: errResult});
//         // res.status(400).json({codeResult: 1, errorsMessages: errResult});
//     } else {
//         next();
//     }
// };

// export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const errResult = errors.array({onlyFirstError: true}).map((error => {
//             return  {message: error.msg, field: error.param}
//         }))
//         return res.status(400).json({errorsMessages: errResult});
//     }
//     next()
// }