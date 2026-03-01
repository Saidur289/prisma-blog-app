
import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client"

export function errorHandler (err:any, req:Request, res:Response, next: NextFunction) {
 let statusCode = 400
 let errorMessage = "internal Server error"
 let errorDetails = err
//  PrismaClientValidationError
if(err instanceof Prisma.PrismaClientValidationError){
    statusCode=400;
    errorMessage = "You provide incorrect field type or missing fields!"

}
else if(err instanceof Prisma.PrismaClientKnownRequestError){
    if(err.code === "P2025"){
        statusCode=400;
        errorMessage="An operation failed because it depends on one or more records that were required but not found."
    }
    else if(err.code === "P2002"){
        statusCode=400;
        errorMessage = "Duplicate key error"
    }
    else if(err.code === "P2003"){
        statusCode=400;
         errorMessage = "Foreign key constraint failed"
    }
}
else if(err instanceof Prisma.PrismaClientUnknownRequestError){
    statusCode = 500;
    errorMessage = "Error occurred during query execution"
}
else if(err instanceof Prisma.PrismaClientInitializationError){
   if(err.errorCode === "P1000"){
     statusCode=400;
     errorMessage = "Authentication failed. Please check your credentials!"
   }
   else if(err.errorCode === 'P1000'){
    statusCode = 401;
    errorMessage = "Can't reach database server"
   }

}
  res.status(statusCode)
  res.json({
    message: errorMessage,
    details: errorDetails
  })
}