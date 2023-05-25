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


const getToDoAtOrderNumber = async (orderNumber) => {
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

const switchOrderNumbers = async (o1, o2) => {
    try {
        await prisma.toDo.updateMany({
            where: {
                order_number: o1
            },
            data: {
                order_number: -1
            },
        });

        await prisma.toDo.updateMany({
            where: {
                order_number: o2
            },
            data: {
                order_number: o1
            },
        });

        await prisma.toDo.updateMany({
            where: {
                order_number: -1
            },
            data: {
                order_number: o2
            },
        });
    } catch (err) {
        console.error('Failed to switch order numbers', err);
        throw err;
    }
}

const updateToDo = async (order_number, newData) => {
    try {
        const updated = await prisma.toDo.updateMany({
            where: {
                order_number: order_number
            },
            data: {
                ...newData
            },
        });

        return updated
    
      } catch (error) {
            console.error('Error updating todos', error);
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

const deleteToDo = async (order_number) => {
    try {

        const deleted = await prisma.toDo.deleteMany({
            where: {
                order_number
            }
        })

        await prisma.toDo.updateMany({
            where: {
                order_number: {
                    gte: order_number + 1,
                },
            },
            data: {
                order_number: {
                    decrement: 1,
                },
            },
        });

        return deleted
    
      } catch (error) {
            console.error('Error incrementing order numbers:', error);
            throw error;
      }
}

const getAllToDoS = async () => {
    try {
        const todos = await prisma.toDo.findMany({
            orderBy: {
                order_number: 'asc'
              }
        });
        return todos;
      } catch (error) {
        console.error('Error fetching todos:', error);
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

    const hasExactMatch = await getToDoAtOrderNumber(order_number)

    if (hasExactMatch && hasExactMatch.length > 0) return {
        canBeInserted: true,
        isNewPoz: false,
    }

    
    let newInsert = await getToDoAtOrderNumber(order_number - 1)

    if (newInsert && newInsert.length > 0) return {
        canBeInserted: true,
        isNewPoz: true,
    }

    newInsert = await getToDoAtOrderNumber(order_number + 1)

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
    insertToDo,
    getAllToDoS,
    getToDoAtOrderNumber,
    updateToDo,
    switchOrderNumbers,
    deleteToDo
}