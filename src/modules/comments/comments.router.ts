import { Router } from "express";
import { CommentController } from "./comments.controller";
import auth, { UserRole } from "../../middleware/auth";




const router = Router()
router.post("/", auth(UserRole.USER, UserRole.USER),  CommentController.createComment)
router.get("/author/:authorId", auth(UserRole.USER, UserRole.ADMIN) ,CommentController.getCommentsByAuthor)
router.get("/:commentId", auth(UserRole.USER, UserRole.ADMIN),  CommentController.getCommentById)
router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), CommentController.deleteComment)
router.patch("/:commentId", auth(UserRole.USER, UserRole.ADMIN), CommentController.updateComment)

export const commentsRouter = router