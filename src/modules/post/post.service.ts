import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async(data: Omit<Post, 'id'| 'createdAt'|'updatedAt' |'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result
}
const getAllPost = async(payload: {search?: string | undefined, tags: string[] | []}) => {
    const andCondition :PostWhereInput[]  = [];
    if(payload.search){
        andCondition.push(  {
               OR :[
               { title: {
                contains : payload.search as string,
                mode: 'insensitive'}
            },
            {
                content: {
                    contains: payload.search as string,
                    mode: 'insensitive'
                },
            },
            {
                tags: {
                    has: payload.search as string,
                    
                }
            }
           ],
           })
    }
    if(payload.tags.length > 0){
        andCondition.push(   {
            tags: {
            hasEvery: payload.tags
           }
        })
    }
    const result = await prisma.post.findMany({
        where: {
         AND: andCondition 
          
     
         
        }
    })
    return result
}
export const postService = {
    createPost,
    getAllPost
}