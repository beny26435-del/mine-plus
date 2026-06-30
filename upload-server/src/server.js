import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import multer from "multer";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4001);
const uploadApiKey = process.env.UPLOAD_API_KEY || "";
const publicBaseUrl = (process.env.PUBLIC_BASE_URL || `http://localhost:${port}`).replace(/\/$/, "");
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["video/mp4", ".mp4"],
  ["video/quicktime", ".mov"],
  ["video/webm", ".webm"]
]);

const imageMaxSize = 5 * 1024 * 1024;
const videoMaxSize = 50 * 1024 * 1024;

function toUploadError(error) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_COUNT") return "حداکثر ۳ فایل قابل ارسال است.";
    if (error.code === "LIMIT_FILE_SIZE") return "حجم فایل بیش از حد مجاز است.";
    return "آپلود فایل انجام نشد.";
  }
  return error instanceof Error ? error.message : "خطای ناشناخته در آپلود فایل.";
}

function getDateParts() {
  const now = new Date();
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, "0")
  };
}

function fileKind(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "file";
}

const storage = multer.diskStorage({
  destination: async (_request, _file, callback) => {
    try {
      const { year, month } = getDateParts();
      const destination = path.join(uploadDir, year, month);
      await fs.mkdir(destination, { recursive: true });
      callback(null, destination);
    } catch (error) {
      callback(error);
    }
  },
  filename: (_request, file, callback) => {
    const extension = allowedMimeTypes.get(file.mimetype);
    const safeName = `${crypto.randomBytes(18).toString("hex")}${extension}`;
    callback(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    files: 3,
    fileSize: videoMaxSize
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("فرمت فایل مجاز نیست."));
      return;
    }
    callback(null, true);
  }
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin مجاز نیست."));
    }
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use("/uploads", express.static(uploadDir, { maxAge: "30d", immutable: true }));

app.get("/health", (_request, response) => {
  response.json({ success: true, message: "Mine Plus upload server is running." });
});

app.post("/api/upload", (request, response) => {
  if (!uploadApiKey || request.header("x-api-key") !== uploadApiKey) {
    response.status(401).json({ success: false, message: "کلید دسترسی آپلود معتبر نیست." });
    return;
  }

  upload.array("files", 3)(request, response, async (error) => {
    if (error) {
      response.status(400).json({ success: false, message: toUploadError(error) });
      return;
    }

    const files = request.files || [];
    if (!files.length) {
      response.status(400).json({ success: false, message: "هیچ فایلی ارسال نشده است." });
      return;
    }

    const invalidFile = files.find((file) => {
      const kind = fileKind(file.mimetype);
      return (kind === "image" && file.size > imageMaxSize) || (kind === "video" && file.size > videoMaxSize);
    });

    if (invalidFile) {
      await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => undefined)));
      response.status(400).json({
        success: false,
        message: fileKind(invalidFile.mimetype) === "image" ? "حجم هر عکس باید حداکثر ۵ مگابایت باشد." : "حجم هر ویدیو باید حداکثر ۵۰ مگابایت باشد."
      });
      return;
    }

    const uploadedFiles = files.map((file) => {
      const relativePath = path.relative(uploadDir, file.path).split(path.sep).join("/");
      return {
        url: `${publicBaseUrl}/uploads/${relativePath}`,
        type: fileKind(file.mimetype),
        filename: file.filename,
        size: file.size
      };
    });

    response.json({ success: true, files: uploadedFiles });
  });
});

app.use((error, _request, response, _next) => {
  void _next;
  response.status(400).json({ success: false, message: toUploadError(error) });
});

app.listen(port, () => {
  console.log(`Mine Plus upload server listening on port ${port}`);
});
