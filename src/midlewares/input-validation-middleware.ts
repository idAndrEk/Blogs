import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

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
        // const errResult = errors.array().map((error) => ({
        const errResult = errors.array({onlyFirstError: true}).map((error) => ({
            message: error.msg,
            field: error.path
        }));
        // console.log("inputValidationMiddleware", errResult)
        // console.log(`Error on the field ${formattedErrors[0].field}`);
        res.status(400).json({errorsMessages: errResult});
    } else {
        next();
    }
};

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

// export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//
//     if (!errors.isEmpty()) {
//         const errResult = errors.mapped();
//
//         const formattedErrors = Object.keys(errResult).map((key) => ({
//             message: errResult[key].msg,
//             field: key,
//         }));
//
//         res.status(400).json({ errorsMessages: formattedErrors });
//     } else {
//         next();
//     }
// };


