import express from "express"


import { PostTodoSchema, combineErrorStrings } from "./utils/validationSchemas.js"
import { checkOrderNumberForInsert, insertToDo } from "./todosController.js"

const router = express.Router()


router.post("/todos", async (req, res) => {

    const { value: ToDo, error } = PostTodoSchema.validate(req.body)

    if (error) {
        return res.status(400).json({
            success: false,
            error: combineErrorStrings(error)
        })
    }

    if (!ToDo) {
        return res.status(400).json({
            success: false,
            error: "todo must contain title and optional: description, due_date, order_number, status ('in_backlog', 'in_progress', 'blocked')"
        })
    }

    const { order_number } = ToDo

    const { canBeInserted, isNewPoz } = await checkOrderNumberForInsert(order_number)

    if (!canBeInserted) {
        return res.status(400).json({
            success: false,
            error: "invalid order_number",
        })
    }

    const insertedToDo = await insertToDo(ToDo, isNewPoz)

    return res.status(201).json(insertedToDo)
})


export default router