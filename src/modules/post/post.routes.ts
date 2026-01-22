import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";



const router = Router()
router.get('/my-posts', auth(UserRole.USER,UserRole.ADMIN),  postController.getMyPosts)
router.get('/', postController.getAllPost)
router.post("/", auth(UserRole.USER, UserRole.ADMIN),  postController.createPost)
router.get('/:id', auth(UserRole.USER,UserRole.ADMIN),  postController.getPostById)
router.patch("/:postId", auth(UserRole.ADMIN, UserRole.USER), postController.updatePost)
router.delete("/:postId", auth(UserRole.ADMIN, UserRole.USER), postController.deletePost)

export const postsRouter = router