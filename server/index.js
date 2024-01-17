require("dotenv").config();
const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;
const DATA_DIR = "./server/data";
const PAGE_SIZE = 5;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "assets")));

// Endpoint to return the list of feed with PAGE_SIZE=5
app.get("/api/feed", async (req, res) => {
  try {
    const page = req.query.page || 0;
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const feedData = await fs.readFile(`${DATA_DIR}/feed.json`, "utf-8");
    const feed = JSON.parse(feedData);

    const paginatedFeed = feed.slice(start, end);
    res.json(paginatedFeed);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to return the list of comments by briefref
app.get("/api/comments/:briefref", async (req, res) => {
  try {
    const briefref = req.params.briefref;

    const commentsData = await fs.readFile(
      `${DATA_DIR}/comments.json`,
      "utf-8"
    );
    const comments = JSON.parse(commentsData);

    const commentsForBriefref = comments.filter(
      (comment) => comment.briefref === briefref
    );
    res.json(commentsForBriefref);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
