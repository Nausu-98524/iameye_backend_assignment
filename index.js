const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8080 || process.env.PORT;

app.post("/get-data", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body || {};

    const fetchData = await fetch(
      "https://jsonplaceholder.typicode.com/photos"
    );
    const data = await fetchData.json();

    // Calculate pagination values
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = data?.slice(startIndex, endIndex);

    return res.status(200).json({
      data: paginatedData,
      total: data.length,
      page: parseInt(page),
      limit: parseInt(limit),
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Failed to fetch data" });
  }
});

app.use("/api/v1", require("./routes/auth.route"));
app.use("/api/v1", require("./routes/user.routes"));

app.listen(PORT, () => {
  console.log("server start...");
});
