import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";



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
const getAllPost = async(req: Request, res: Response) => {
    try{
        const {search} = req.query
        const searchText = typeof search === "string"? search : undefined
        const tags = req.query.tags? (req.query.tags as string).split(",") : [];
        const isFeatured = req.query.isFeatured ?
         req.query.isFeatured === 'true'?true : 
         req.query.isFeatured === 'false'? false: undefined 
          : undefined
    
        // console.log({isFeatured});
        const status = req.query.status as PostStatus | undefined
        // console.log(status);
        const authorId = req.query.authorId as string | undefined
        console.log({authorId});
     const result = await postService.getAllPost({search: searchText, tags, isFeatured, status, authorId})
     res.status(200).json({
        success: true,
      date: result,
      length: result.length
     })
    }
    catch (error) {
        res.status(400).json({
            error: "get all post  fail",
            wrong: error
            
        })
    }
}
export const postController = {
    createPost,
    getAllPost
}