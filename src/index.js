const express = require("express");
require("./db/mongoose");
const cors = require("cors");
const bookRouter = require("./routers/booksRouter");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bookRouter);
app.use(userRouter);
app.use(adminRouter);

app.listen(port, () => {
    console.log("Server is running on port ", port);
});
