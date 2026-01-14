import { Request, Response } from "express";
import { postService } from "./post.service";


const createPost = async(req: Request, res: Response) => {
    try {
        // console.log(req.user, "hello");
        //find authorId from login user from his token by session by middleware
        const user = req.user
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const result = await postService.createPost(req.body , user.id)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({
            error: "post created fail",
            wrong: error
            
        })
    }
}
export const postController = {
    createPost
}