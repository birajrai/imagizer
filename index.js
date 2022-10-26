// Settings <3
const config = require("./settings.js");

// Packages
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const express = require("express");

const app = (module.exports = express());
app.set("view engine", "ejs");
app.use("/", express.static("public"));
app.use("/images", express.static("data"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/data`,
  }),
  limits: {
    fileSize: 104857600,
  },
  fileFilter: function (req, file, callback) {
    const supportedFiletypes = [
      "image/gif",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (supportedFiletypes.indexOf(file.mimetype) < 0) {
      if (!req.skippedFiles) {
        req.skippedFiles = [file.originalname];
      } else {
        req.skippedFiles.push(file.originalname);
      }
      return callback(null, false);
    }
    callback(null, true);
  },
});

// Index Router
app.get("/", (req, res) => {
  res.render("index", { title: config.title, alert: null });
});
// Upload and Error Router :')
app.post("/", upload.single("image"), (req, res) => {
  const file = req.file;
  if (file) {
    const type = file.mimetype.split("/");
    const name = randomString(10);
    fs.renameSync(
      `${__dirname}/data/${file.filename}`,
      `${__dirname}/data/${name}.${type[1]}`
    );
    res.redirect(`/${name}.${type[1]}`);
  } else {
    res.render("index", {
      alert: "Only GIF, JPEG/JPG and PNG are allowed.",
    });
  }
});

// Main Router
app.post("/", upload.single("image"), (req, res) => {
  const file = req.file;
  if (file) {
    const type = file.mimetype.split("/");
    const name = randomString(10);
    fs.renameSync(
      `${__dirname}/data/${file.filename}`,
      `${__dirname}/data/${name}.${type[1]}`
    );
    res.send({ url: `${config.domain}/${name}.${type[1]}` });
  } else {
    res.send({ url: null });
  }
});

// File Display Router
app.get("/:filename", (req, res) => {
  try {
    const fileName = req.params.filename;
    const fileStats = fs.statSync(`${__dirname}/data/${fileName}`);
    const fileDate = `${fileStats.birthtime.toDateString()}, ${fileStats.birthtime.getHours()}:${fileStats.birthtime.getMinutes()}`;
    const fileSize = Math.round((fileStats.size / (1024 * 1024)) * 100) / 100;
    res.render("viewer", {
      title: config.title,
      fileName: fileName,
      fileSize: fileSize,
      fileDate: fileDate,
      randomHexColor: randomHexColor(),
      description: `I wasted ${fileSize}MB on ${fileDate}`,
    });
  } catch (error) {
    res.redirect("/");
  }
});

if (!module.parent) {
  app.listen(config.port);
  console.log(`Server started on  ${config.domain}:${config.port}`);
}

function randomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function randomString(length) {
  const randomChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}
