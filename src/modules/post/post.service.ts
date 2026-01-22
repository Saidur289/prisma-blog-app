

import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
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
const getAllPost = async(payload: {search?: string | undefined, tags: string[] | [], isFeatured: boolean | undefined, status: PostStatus | undefined, authorId: string | undefined , page: number, limit: number, skip: number, sortBy: string, sortByOrder: string}) => {
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
    if(typeof payload.isFeatured === 'boolean'){
        andCondition.push({
            isFeatured: payload.isFeatured
        })
    }
    if(payload.status){
        andCondition.push({
            status: payload.status
        })
    }
    if(payload.authorId){
        andCondition.push({
            authorId: payload.authorId
        })
    }
    const totalPost = await prisma.post.findMany({
        take: payload.limit,
        skip: payload.skip,
        where: {
         AND: andCondition     
        },
        orderBy: {
            [payload.sortBy]: payload.sortByOrder
        },
        include: {
            _count: {
                select: {comment: true}
            }
        }
    })
    const totalCount = await prisma.post.count({
         where: {
         AND: andCondition     
        }
    })
    return {
        data: totalPost,
        pagination: {
            totalCount,
            page: payload.page,
            limit: payload.page,
            totalPage: Math.ceil(totalCount/ payload.limit)
        }
    }
}
const getPostById = async(id: string ) => {
    // console.log("get post by id");
  return await prisma.$transaction(async (tx) => {
  await tx.post.update({
    where: {
      id: id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  const postData = await tx.post.findUnique({
    where: {
      id: id,
    },
    include: {
        comment: {
            where: {
                parentId: null,
                status: CommentStatus.APPROVED
            },
            orderBy: {createdAt: 'desc'},
            include: {
                replies: {
                    where: {
                        status: CommentStatus.APPROVED,
                    },
                    orderBy: {createdAt: "asc"},
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: {createdAt: 'asc'},
                        }
                    }
                }
            }
        },
         _count:{
         select:{
            comment: true
         }
        },
    }
  });

  return postData;
});

   
    
}
const getMyPosts = async(id: string) => {
    await prisma.user.findUniqueOrThrow({
        where: {
          id,
          status: "ACTIVE"
        },
        select: {
            id: true
        }
    })
   const result = await prisma.post.findMany({
    where: {
        authorId: id
    },
    orderBy: {createdAt: "desc"},
    include: {
        _count: {
            select: {
                comment: true
            }
        }
    }
   })
    const total = await prisma.post.aggregate({
      _count: {
        id: true
      },
      where: {
        authorId: id
      }
    })
    return {
        result, total
    }
}
// user not able to update isFeature 
//admin will able to update everything
const updatePost = async(postId: string, authorId: string, data: Partial<Post>, isAdmin: boolean) => {
 console.log(postId, authorId, data);
 const postData = await prisma.post.findUniqueOrThrow({
    where: {
        id: postId,
        
    },
    select: {
        id: true,
        authorId: true
    }
 })
//  but user can not update isFeature 
 if(!isAdmin){
    delete data.isFeatured
 }
 //user and admin can update post 
 if(!isAdmin && (postData.authorId !== authorId)) {
    throw new Error ("You are not owner")
 }
 return await prisma.post.update({
    where: {
        id: postId,
        
    },
    data
 })
}
export const postService = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost

}