import { PostTodoSchema, combineErrorStrings } from "../utils/validationSchemas.js"
const hasValidPOSTData = (req, res, next) => {
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

    req.todo_data = ToDo
    next()
}

export default hasValidPOSTData