import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const createComment = async(payload: {content: string, postId: string, authorId: string, parentId?: string}) => {
    // console.log(payload, 'hello');
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })
    if(payload.parentId){
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }
    return await prisma.comment.create({
        data: payload
    })
}
const getCommentById = async(id: string)  => {
    // console.log("commentId: ",id);
    const result = await prisma.comment.findUnique({
        where: {
            id
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true,
                }
            }
        }
    })
    return result
}
const getCommentsByAuthor = async(authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {createdAt: 'desc'},
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    return result
}
const deleteComment = async(commentId: string, authorId: string) => {
    // console.log({commentId, authorId});
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        }
    })
    // console.log(commentData);
    if(!commentData){
        throw new Error("Invalid Input")
    }
    return await prisma.comment.delete({
        where: {
            id: commentData?.id as string,
        },
    })
}
const updateComment = async(commentId: string, data: {content?: string, status?: CommentStatus}, authorId: string) => {
    // console.log({commentId, data, authorId});
     const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        }
    })
    // console.log(commentData);
    if(!commentData){
        throw new Error("Invalid Input")
    }
    return await prisma.comment.update({
        where: {
            id: commentData.id as string,
            authorId
        },
        data
    })
}
export const CommentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment
}