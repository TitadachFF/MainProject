const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const courseRouter = require("./routers/courseRouter"); 
const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", courseRouter); 
app.use(express.urlencoded({ extended: false }));





app.listen(3000, () => {
  console.log("Server running on port 3000");
});
