import express, { Request, Response } from "express"
import { postsRouter } from "./modules/post/post.routes"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app = express()
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json())
app.use('/posts', postsRouter)
app.get('/', async(req: Request, res: Response) => {
    res.send("hello world")
})
export default app