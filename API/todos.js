import express from "express"


import { PostTodoSchema, combineErrorStrings } from "./utils/validationSchemas.js"
import hasValidOrderNumber from "./middleware/hasValidOrderNumber.js"
import hasValidPUTData from "./middleware/hasValidPUTData.js"
import hasValidPATCHData from "./middleware/hasValidPATCHData.js"
import hasValidPOSTData from "./middleware/hasValidPOSTData.js"
import { deleteToDo } from "./todosController.js"

import { 
    checkOrderNumberForInsert,
    insertToDo,
    getAllToDoS,
    getToDoAtOrderNumber,
    updateToDo,
    switchOrderNumbers
 } from "./todosController.js"

const router = express.Router()


router.post("/todos", hasValidPOSTData, async (req, res) => {

    const { order_number } = req.todo_data

    const { canBeInserted, isNewPoz } = await checkOrderNumberForInsert(order_number)

    if (!canBeInserted) {
        return res.status(400).json({
            success: false,
            error: "invalid order_number",
        })
    }

    const insertedToDo = await insertToDo(req.todo_data, isNewPoz)

    return res.status(201).json(insertedToDo)

})

router.get("/todos", async (req, res) => {
    const allToDoS = await getAllToDoS()

    return res.status(200).json(allToDoS)
})


router.get("/todos/:order_number", hasValidOrderNumber, async (req, res) => {

    return res.status(200).json(req.toDo)
   
})


router.put("/todos/:order_number", [hasValidOrderNumber, hasValidPUTData], async (req, res) => {

    const old_order_number = req.toDo.order_number

    const new_order_number = req.todo_data.order_number
    
    const change_order = (!isNaN(new_order_number) && (old_order_number !== new_order_number))

    if (!change_order) {
        const updated = await updateToDo(req.order_number, req.todo_data)

        return res.status(200).json(updated[0])
    }

    let change_order_valid = change_order && await getToDoAtOrderNumber(new_order_number)

    if (change_order && change_order_valid && change_order_valid.length === 0) {
        return res.status(404).json({
            success: false,
            error: "target order_number is not valid"
        })
    }

    delete req.todo_data.order_number

    await switchOrderNumbers(old_order_number, new_order_number)

    const updated = await updateToDo(new_order_number, req.todo_data)
      
    return res.status(200).json(updated[0])
   
})



router.patch("/todos/:order_number", [hasValidOrderNumber, hasValidPATCHData], async (req, res) => {

    const old_order_number = req.toDo.order_number

    const new_order_number = req.todo_data.order_number
    
    const change_order = (!isNaN(new_order_number) && (old_order_number !== new_order_number))

    if (!change_order) {
        const updated = await updateToDo(req.order_number, req.todo_data)

        return res.status(200).json(updated[0])
    }

    let change_order_valid = change_order && await getToDoAtOrderNumber(new_order_number)

    if (change_order && change_order_valid && change_order_valid.length === 0) {
        return res.status(404).json({
            success: false,
            error: "target order_number is not valid"
        })
    }

    delete req.todo_data.order_number

    await switchOrderNumbers(old_order_number, new_order_number)

    const updated = await updateToDo(new_order_number, req.todo_data)
      
    return res.status(200).json(updated[0])
   
})

router.delete("/todos/:order_number", hasValidOrderNumber, async (req, res) => {
    const deleted = await deleteToDo(req.order_number)

    return res.status(204).json(deleted[0])
})

export default router