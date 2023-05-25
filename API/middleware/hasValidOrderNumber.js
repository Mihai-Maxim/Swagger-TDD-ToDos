import { getToDoAtOrderNumber } from "../todosController.js"
const hasValidOrderNumber = async (req, res, next) => {
    let { order_number } = req.params

    const parsed_order_number = parseInt(order_number)
    if (!order_number || isNaN(parsed_order_number) || parsed_order_number < 0) {
        return res.status(400).json({
            success: false,
            error: "you must provide a positive order number for the todo"
        })
    }

    const toDo = await getToDoAtOrderNumber(parsed_order_number)

    if (toDo.length === 0) {
        return res.status(404).json({
            success: false,
            error: "invalid order_number"
        })
    }

    req.toDo = toDo[0]
    req.order_number = parsed_order_number
    next()
}

export default hasValidOrderNumber