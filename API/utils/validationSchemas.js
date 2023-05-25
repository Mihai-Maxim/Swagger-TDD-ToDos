import Joi from "joi";


const PostTodoSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    due_date: Joi.date()
       .greater(Date.now())
       .required(),
    status: Joi.string()
       .valid('in_backlog', 'in_progress', 'blocked')
       .default('in_backlog'),
    order_number: Joi.number()
       .integer()
       .min(0)
});

const PutTodoSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    due_date: Joi.date()
       .greater(Date.now())
       .required(),
    status: Joi.string()
       .valid('in_backlog', 'in_progress', 'blocked', 'completed')
       .default('in_backlog')
       .required(),
    order_number: Joi.number()
       .integer()
       .min(0)
       .required()
});


const PatchTodoSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    due_date: Joi.date()
       .greater(Date.now()),
    status: Joi.string()
       .valid('in_backlog', 'in_progress', 'blocked', 'completed')
       .default('in_backlog'),
    order_number: Joi.number()
       .integer()
       .min(0)
})

const combineErrorStrings = (error) => {
    return error.details.map(err => err.message)
}

export {
    PostTodoSchema,
    combineErrorStrings,
    PutTodoSchema,
    PatchTodoSchema,
}
  