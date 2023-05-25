import request from 'supertest';
import app from "../app.js"



const first_to_do_date = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString()

describe('POST /api/todos', () => {

    it('should create a new todo', async () => {
      const todoData = {
        title: 'New Todo 1',
        description: 'This is a new todo',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
      };

  
      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

      const todo = response.body
      expect(typeof todo.creation_date).toBe("string")
      expect(typeof todo.last_update_date).toBe("string")
      expect(todo.title).toBe("New Todo 1")
      expect(todo.description).toBe("This is a new todo")
      expect(todo.status).toBe("in_progress")

    })

    it('should create a new todo at specified order number', async () => {
      const todoData = {
        order_number: 0,
        title: 'New Todo 2',
        description: 'This is the first todo',
        due_date: first_to_do_date,
        status: 'in_progress',
      };
  
      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

      const todo = response.body
      expect(typeof todo.creation_date).toBe("string")
      expect(typeof todo.last_update_date).toBe("string")
      expect(todo.title).toBe("New Todo 2")
      expect(todo.description).toBe("This is the first todo")
      expect(todo.status).toBe("in_progress")
      expect(todo.order_number).toBe(0)

    });
  
    it('should return 400 if todo data is invalid', async () => {
      const invalidTodoData = {
        description: 'Invalid Todo Data', 
      };
  
      const resonse = await request(app)
        .post('/api/todos')
        .send(invalidTodoData)
        .expect(400);
    });
  
    it('should return 400 if due date is in the past', async () => {
      const todoData = {
        title: 'Past Due Todo',
        description: 'This todo is already past due',
        due_date: new Date(new Date().getTime() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
      };
  
      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(400);
        
    });
  
    it('should return 400 if status is invalid', async () => {
      const todoData = {
        title: 'Invalid Status Todo',
        description: 'This todo has an invalid status',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'invalid_status', // Invalid status
      };
  
      await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(400);
    });
  
    it('should return 400 if status is completed', async () => {
      const todoData = {
        title: 'Completed Todo',
        description: 'This todo is already completed',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
      };
  
      await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(400);
    });

    it('should return 400 if order_number is negative', async () => {
      const todoData = {
        order_number: -1,
        title: 'Completed Todo',
        description: 'This todo is already completed',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
      };
  
      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(400);
      
    });


    it('should return 400 if order_number is too high and can t be found', async () => {
      const todoData = {
        order_number: 9999999999,
        title: 'Completed Todo',
        description: 'This todo is already completed',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
      };
  
      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(400);

      expect(response.body.error).toBe("invalid order_number")
    });
});

describe('GET /api/todos', () => {

    it('should get all todos', async () => {

      const todoData = {
        order_number: 0,
        title: 'New Todo 2',
        description: 'This is the first todo',
        due_date: first_to_do_date,
        status: 'in_progress',
      };
  
      await request(app)
        .post('/api/todos')
        .send(todoData)

      const response = await request(app)
        .get('/api/todos')
        .expect(200);
  
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const first = response.body[0]

      expect(first.due_date).toBe(first_to_do_date)


      expect(typeof first.order_number).toBe("number")


      expect(typeof first.creation_date).toBe("string")
      expect(typeof first.last_update_date).toBe("string")
      expect(typeof first.title).toBe("string")
      expect(typeof first.description).toBe("string")
      expect(typeof first.status).toBe("string")
      
    });
});

describe('GET /api/todos/{order_number}', () => {
  it('should get a specific todo', async () => {
    const response = await request(app)
      .get(`/api/todos/0`)
      .expect(200);

    expect(response.body.order_number).toBe(0);
  });

  it('should return 404 if order number is not found', async () => {
    await request(app)
      .get('/api/todos/999999999')
      .expect(404);
  });

  it('should return 400 if order number is not a number >= 0', async () => {
    await request(app)
      .get('/api/todos/-1')
      .expect(400);
  });


});

describe('PUT /api/todos/{order_number}', () => {

  it('should update a specific todo', async () => {
    const todoData1 = {
      order_number: 0,
      title: 'first insert',
      description: 'blahblah',
      due_date: first_to_do_date,
      status: 'in_progress',
    };

    const todoData2 = {
      order_number: 1,
      title: 'second insert',
      description: 'hello there',
      due_date: first_to_do_date,
      status: 'in_progress',
    };

    await request(app)
      .post('/api/todos')
      .send(todoData1)

    await request(app)
      .post('/api/todos')
      .send(todoData2)

    const newDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString()

    const r1 = await request(app)
      .put(`/api/todos/0`)
      .send({
        order_number: 0,
        title: 'first insert update without change',
        description: 'This todo has been updated',
        due_date: newDate,
        status: 'completed',
      })
      .expect(200);

    let response = await request(app)
      .get(`/api/todos/0`)
      .expect(200);

    expect(response.body.description).toBe("This todo has been updated");
    expect(response.body.title).toBe("first insert update without change")
    expect(response.body.order_number).toBe(0)
    expect(response.body.due_date).toBe(newDate)

    response = await request(app)
      .get(`/api/todos/1`)
      .expect(200);

    expect(response.body.description).toBe("hello there");
    expect(response.body.title).toBe("second insert")
    expect(response.body.order_number).toBe(1)
    expect(response.body.due_date).toBe(first_to_do_date)

  });
  it('should update a specific todo and change order', async () => {
    const todoData1 = {
      order_number: 0,
      title: 'first insert',
      description: 'blahblah',
      due_date: first_to_do_date,
      status: 'in_progress',
    };

    const todoData2 = {
      order_number: 1,
      title: 'second insert',
      description: 'hello there',
      due_date: first_to_do_date,
      status: 'in_progress',
    };

    await request(app)
      .post('/api/todos')
      .send(todoData1)

    await request(app)
      .post('/api/todos')
      .send(todoData2)


    const newDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString()

    const r1 = await request(app)
      .put(`/api/todos/0`)
      .send({
        order_number: 1,
        title: 'Updated ToDo',
        description: 'This todo has been updated',
        due_date: newDate,
        status: 'completed',
      })
      .expect(200);

    let response = await request(app)
      .get(`/api/todos/1`)
      .expect(200);

    expect(response.body.description).toBe("This todo has been updated");
    expect(response.body.title).toBe("Updated ToDo")
    expect(response.body.order_number).toBe(1)
    expect(response.body.due_date).toBe(newDate)

    response = await request(app)
      .get(`/api/todos/0`)
      .expect(200);

    expect(response.body.description).toBe("hello there");
    expect(response.body.title).toBe("second insert")
    expect(response.body.order_number).toBe(0)
    expect(response.body.due_date).toBe(first_to_do_date)

  });

  it('should return 404 if order_number is not found', async () => {

    const response = await request(app)
      .put('/api/todos/99999') 
      .send({
        order_number: 0,
        title: 'Updated ToDo',
        description: 'This todo has been updated',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
    });

    expect(response.status).toBe(404);
  });

  it('should return 400 if order_number is not a number >= 0', async () => {
    const response = await request(app)
      .put('/api/todos/invalid_order_number')
      .send({
        title: 'Updated ToDo',
        description: 'This todo has been updated',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 if status is not valid', async () => {
    const response = await request(app)
      .put('/api/todos/0')
      .send({
        title: 'Updated ToDo',
        description: 'This todo has been updated',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'abcd',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 if due_date is not a valid date', async () => {
    const response = await request(app)
      .put('/api/todos/0')
      .send({
        title: 'Updated ToDo',
        description: 'This todo has been updated',
        due_date: "blah blah",
        status: 'completed',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 if due_date is in the past', async () => {
    const response = await request(app)
      .put('/api/todos/0')
      .send({
        title: 'Updated ToDo',
        description: 'This todo has been updated',
        due_date: new Date(new Date().getTime() -5000 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 if not all required fields are present (title, due_date, status, order_number)', async () => {
    const response = await request(app)
      .put('/api/todos/0')
      .send({
        description: 'This todo has been updated',
        status: 'completed',
    });

    expect(response.status).toBe(400);
  });


});

describe('PATCH /api/todos/{order_number}', () => {
  it('should update specific fields of a todo', async () => {
    const newDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString()
    const updatedFields = {
      title: 'Modified Title',
      description: "hello from the other side",
      due_date: newDate
    };

    await request(app)
      .patch(`/api/todos/0`)
      .send(updatedFields)
      .expect(200);

    const response = await request(app)
      .get(`/api/todos/0`)
      .expect(200);

    expect(response.body.title).toBe(updatedFields.title);
    expect(response.body.title).toBe(updatedFields.title);
    expect(response.body.description).toBe("hello from the other side");
    expect(response.body.due_date).toBe(newDate);

    expect(typeof response.body.creation_date).toBe("string")
    expect(typeof response.body.last_update_date).toBe("string")
    expect(typeof response.body.status).toBe("string")
  });


  it('should return 400 if due_date is in the past', async () => {
    const response = await request(app)
      .patch('/api/todos/0')
      .send({
        title: 'Modified Title',
        due_date: new Date(new Date(new Date().getTime() - 8 * 60 * 60 * 1000).toISOString())
      });

    expect(response.status).toBe(400);
  });

});

describe('DELETE /api/todos/{order_number}', () => {
    it('should delete a todo and update the order numbers', async () => {

        const todo1Data = {
          order_number: 0,
          title: 'Todo 1',
          description: 'This is the first todo',
          due_date: new Date(new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString()),
          status: 'in_progress',
        };
        const todo2Data = {
          order_number: 1,
          title: 'Todo 2',
          description: 'This is the second todo',
          due_date: new Date(new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString()),
          status: 'in_progress',
        };
        const todo3Data = {
          order_number: 2,
          title: 'Todo 3',
          description: 'This is the third todo',
          due_date: new Date(new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString()),
          status: 'in_progress',
        };
    
        const todo1Response = await request(app)
          .post('/api/todos')
          .send(todo1Data)
          .expect(201);
    
        const todo2Response = await request(app)
          .post('/api/todos')
          .send(todo2Data)
          .expect(201);
    
        const todo3Response = await request(app)
          .post('/api/todos')
          .send(todo3Data)
          .expect(201);
    
        // Delete the second todo
        await request(app)
          .delete(`/api/todos/1`)
          .expect(204);
    
        // Retrieve all todos
        const response = await request(app)
          .get('/api/todos')
          .expect(200);
    
        const todos = response.body;
    
        // Check if order numbers have been updated correctly
        expect(todos[0].order_number).toBe(0);
        expect(todos[1].order_number).toBe(1);

        expect(todos[1].description).not.toBe("This is the second todo")
      });
});
