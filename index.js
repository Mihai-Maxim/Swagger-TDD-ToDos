import app from "./app.js";

const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
    console.log(`Listening at http://localhost:${PORT}`)
})