import { PatchTodoSchema, combineErrorStrings } from "../utils/validationSchemas.js"
const hasValidPATCHData = (req, res, next) => {
    const { value: ToDo, error } = PatchTodoSchema.validate(req.body)

    if (error) {
        return res.status(400).json({
            success: false,
            error: combineErrorStrings(error)
        })
    }

    if (!ToDo) {
        return res.status(400).json({
            success: false,
            error: "patch can contain title, description, due_date, order_number, status ('in_backlog', 'in_progress', 'blocked')"
        })
    }

    if (Object.keys(ToDo).length === 0) {
        return res.status(400).json({
            success: false,
            error: "todo must contain at least one field to update: title, description, due_date, order_number, status ('in_backlog', 'in_progress', 'blocked')"
        })
    }

    req.todo_data = ToDo
    next()
}

export default hasValidPATCHData