require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

//app
const app = express();

//middlewears
app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to ByteAtlas server" });
});

app.use("/api/auth/user", userRoutes);

const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URI;

//mongoose
mongoose.connect(uri, { useUnifiedTopology: true }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
