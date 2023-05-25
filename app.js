import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from "express"
import bodyParser from "body-parser"
import todosRouter from "./API/todos.js"

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.use("/api/", todosRouter)


export default app