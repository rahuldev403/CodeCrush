import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, DevTinder! now with tsx watch , now i am auto-reloading");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
