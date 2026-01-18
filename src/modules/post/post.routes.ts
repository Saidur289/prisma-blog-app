import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";



const router = Router()
router.get('/', postController.getAllPost)
router.post("/", auth(UserRole.USER),  postController.createPost)
router.get('/:id', postController.getPostById)
export const postsRouter = router