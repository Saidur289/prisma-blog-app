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
const getCommentById = async(req: Request, res: Response) => {
    try {
         const {commentId} = req.params
         const result = await CommentService.getCommentById(commentId as string)
        
        res.status(200).json({
            success: true,
            msg: 'get single comments',
            data: result
        })
      
        
    } catch (error) {
        res.status(400).json({
            error: "create comments fail",
            wrong: error
            
        })
    }
}
const getCommentsByAuthor = async(req: Request, res: Response) => {
    try {
         const {authorId} = req.params
        //  console.log("authorId",authorId);
         const result = await CommentService.getCommentsByAuthor(authorId as string)
        
        res.status(200).json({
            success: true,
            msg: 'get single comments',
            data: result
        })
      
        
    } catch (error) {
        res.status(400).json({
            error: "create comments fail",
            wrong: error
            
        })
    }
}
const deleteComment = async(req: Request, res: Response) => {
    try {
        const user = req.user
        if(!user) return undefined
        const {commentId} = req.params
        const result = await CommentService.deleteComment(commentId as string, user.id as string)
        res.status(200).json({
            success: true,
            msg: 'deleted successfully',
            
        })
      
        
    } catch (error) {
        res.status(400).json({
            error: "create comments fail",
            wrong: error
            
        })
    }
}
const updateComment = async(req: Request, res: Response) => {
    try {
        const user = req.user
        if(!user) return undefined
        const {commentId} = req.params
        const result = await CommentService.updateComment(commentId as string, req.body  ,user.id as string)
        res.status(200).json({
            success: true,
            msg: 'update comments successfully',
            data: result
            
        })
      
        
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : "update  comments fail"
        res.status(400).json({
            error: errorMessage,
            
            
        })
    }
}
const moderateComment = async(req: Request, res: Response) => {
    try {
        const {commentId} = req.params
        const result = await CommentService.moderateComment(commentId as string, req.body)
        res.status(200).json({
            success: true,
            msg: 'update status successfully',
            data: result
            
        })
      
        
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "update  status fail"
        res.status(400).json({
            error: errorMessage,
            wrong: error
            
        })
    }
}
export const CommentController = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    moderateComment
}