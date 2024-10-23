import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationError } from 'express-validator'

export const validateObjectIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/
    const {id} = req.params
    if (!objectIdPattern.test(id)) {
        res.sendStatus(400)
        return
    }
    next()
};

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
            return res.status(400).send({
                errorsMessages: errors.array({ onlyFirstError: true }).map((e: ValidationError) => ({
                    message: e.msg,
                    field: (e as any).path
                }))
        })
    }
    return next()
}





