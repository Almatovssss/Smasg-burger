const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Statik fayllar uchun
app.use(express.static(path.join(__dirname, "public")));

app.post("/order", (req, res) => {
  console.log("Yangi buyurtma:", req.body);
  res.json({
    success: true,
    message: "Buyurtma qabul qilindi!",
    received: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
