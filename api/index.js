import express from "express";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import { handleError } from "./middleware/error.js";

const app = express();

app.use(express.json());

//routes
app.use("/api/auth", authRouter);

//error handler
app.use(handleError);

//database
connectDB();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
