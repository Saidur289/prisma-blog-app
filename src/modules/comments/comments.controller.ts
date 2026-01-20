import { Request, Response } from "express"
import { CommentService } from "./comments.service"

const createComment = async(req: Request, res: Response) => {
    try {
        const user = req.user
        console.log(user, "user bro");
        if(!user){
            return undefined
        }
        req.body.authorId = user.id
        const result = await CommentService.createComment(req.body)
        res.status(201).json({
            msg: 'comments created',
            data: result
        })
      
        
    } catch (error) {
        res.status(400).json({
            error: "create comments fail",
            wrong: error
            
        })
    }
}
export const CommentController = {
    createComment
}