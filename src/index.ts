import express from "express";
import {blogsRouter} from "./routes/blogs-router";
import {runDb} from "./db/db";
import {clearDatabaseRouter} from "./routes/clearDatabase-router";
import {postsRouter} from "./routes/posts-router";

export const app = express()
const port = 5000

// const parserMiddleware = bodyParser({})
// app.use(parserMiddleware)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', clearDatabaseRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()