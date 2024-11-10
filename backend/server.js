import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Server...");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
