import express, { Request, Response } from "express"
import { postsRouter } from "./modules/post/post.routes"
import { toNodeHandler } from "better-auth/node";
import cors from 'cors'
import { auth } from "./lib/auth";
const app = express()
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:4000"], // client url set origin in postman
    credentials: true
}))
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json())

app.use('/posts', postsRouter)
app.get('/', async(req: Request, res: Response) => {
    res.send("hello world")
})
export default app