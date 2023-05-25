import prisma from "./utils/dbConn.js"


const getToDosCount = async () => {
    try {
        const count = await prisma.toDo.count();
        return count;
      } catch (error) {
        console.error('Error retrieving ToDo count:', error);
        throw error;
      }
}



const getOrderNumberAt = async (orderNumber) => {
    try {
        const todos = await prisma.toDo.findMany({
            where: {
              order_number: orderNumber
            },
        });
        return todos;
    } catch (error) {
        console.log(error)
        console.error('Error retrieving ToDos:', error);
        throw error;
    }
}



const insertToDo = async (toDo, isNewPoz) => {

    const { order_number } = toDo

    const has_order_number = order_number || order_number === 0

    if (!isNewPoz && has_order_number) {
        try {
            await prisma.toDo.updateMany({
              where: {
                order_number: {
                  gte: order_number,
                },
              },
              data: {
                order_number: {
                  increment: 1,
                },
              },
            });
        
          } catch (error) {
            console.error('Error incrementing order numbers:', error);
            throw error;
          }
    }

    if (!has_order_number) {

        const count = await getToDosCount()

        toDo.order_number = count
    }
  
    try {
        const newToDo = await prisma.toDo.create({
            data: toDo,
        });
        return newToDo;
    } catch (error) {
        console.error('Error adding new ToDo:', error);
        throw error;
    }

}




const checkOrderNumberForInsert = async (order_number) => {

    if (order_number < 0) return {
        canBeInserted: false,
        isNewPoz: false
    }

    if (!order_number && order_number !== 0) return {
        canBeInserted: true,
        isNewPoz: true
    }

    const count = await getToDosCount()

    if ((count === 0) && (order_number === 0)) return {
        canBeInserted: true,
        isNewPoz: true,
    }

    const hasExactMatch = await getOrderNumberAt(order_number)

    if (hasExactMatch && hasExactMatch.length > 0) return {
        canBeInserted: true,
        isNewPoz: false,
    }

    
    let newInsert = await getOrderNumberAt(order_number - 1)

    if (newInsert && newInsert.length > 0) return {
        canBeInserted: true,
        isNewPoz: true,
    }

    newInsert = await getOrderNumberAt(order_number + 1)

    if (newInsert && newInsert.length > 0) return {
        canBeInserted: true,
        isNewPoz: true,
    }

    return  {
        canBeInserted: false,
        isNewPoz: false,
    }

}



export {
    checkOrderNumberForInsert,
    insertToDo
}