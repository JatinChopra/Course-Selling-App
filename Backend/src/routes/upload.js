const router = require("express").Router();
var admin = require("firebase-admin");
require("dotenv").config();
const multer = require("multer");
const upload = multer({});

var serviceAccount = require("../../serviceAccountKey.json");
const { getStorage } = require("firebase-admin/storage");
const verifyJWT = require("../middlewares/verifyJWT");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const bucket = getStorage().bucket(process.env.BUCKET_URL);

router.post("/upload", verifyJWT, upload.single("file"), (req, res) => {
  console.log(req.file);

  const fileSize = Math.ceil(req.file.size / 1000000);
  console.log(fileSize);

  const fileObj = bucket.file(req.file.originalname);
  const stream = fileObj.createWriteStream();
  stream.end(req.file.buffer);

  stream.on("error", (err) => {
    return res.status(500).json({ message: "Error while uploading file." });
  });

  stream.on("finish", async () => {
    await fileObj.makePublic();
    const url = fileObj.publicUrl();
    res.json({ message: "File was uploaded successfully.", url: url });
  });
});

module.exports = router;
