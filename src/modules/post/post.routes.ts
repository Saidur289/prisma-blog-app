import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";



const router = Router()
router.get('/my-posts', auth(UserRole.USER,UserRole.ADMIN),  postController.getMyPosts)
router.get('/', postController.getAllPost)
router.post("/", auth(UserRole.USER, UserRole.ADMIN),  postController.createPost)
router.get('/:id', auth(UserRole.USER,UserRole.ADMIN),  postController.getPostById)
router.patch("/:postId/update-post", auth(UserRole.ADMIN, UserRole.USER), postController.updatePost)

export const postsRouter = router