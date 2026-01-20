import { Router } from "express";
import { CommentController } from "./comments.controller";
import auth, { UserRole } from "../../middleware/auth";




const router = Router()
router.post("/", auth(UserRole.USER, UserRole.USER),  CommentController.createComment)

export const commentsRouter = router