import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortHelper from "../../helper/paginationSortHelper";
import { prisma } from "../../lib/prisma";



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
        // console.log({authorId});
          const {page, limit, skip, sortBy, sortByOrder} = paginationSortHelper(req.query)
           console.log("page: ",page, "limit: ", limit, "skip: ", skip, "sort: ", sortBy, "orderBy: ", sortByOrder);
     const result = await postService.getAllPost({search: searchText, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortByOrder})
     res.status(200).json({
        success: true,
      date: result,
      
     })
    }
    catch (error) {
        res.status(400).json({
            error: "get all post  fail",
            wrong: error
            
        })
    }
}
const getPostById = async(req: Request, res: Response) => {
    try {
        const {id} = req.params
        // console.log("id: ", id);
        if(!id){
            throw new Error("post id is required")
        }
        
        const result = await postService.getPostById(id as string)
        res.status(200).json({
            success: true,
            msg: "post by id",
            data: result
        })
        // console.log(result);
    } catch (error) {
        res.status(400).json({
            error: "get all post  fail",
            wrong: error
            
        })
    }
}
export const postController = {
    createPost,
    getAllPost,
    getPostById
}