import express, { type Express } from "express";
import cors from "cors";
import path from "node:path";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve downloaded WhatsApp/Meta media files
const mediaDir = path.join(process.cwd(), 'var', 'media');
app.use('/api/media', express.static(mediaDir, {
  maxAge: '7d',
  immutable: true,
}));

// API Routes
app.use("/api", router);

// Serve dashboard static build files (SPA)
const dashboardDist = path.join(process.cwd(), 'artifacts', 'dashboard', 'dist', 'public');
app.use(express.static(dashboardDist));

// Wildcard fallback for React Router SPA
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(dashboardDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.json({ status: "ok", name: "SupportHub AI API Server", timestamp: new Date() });
    }
  });
});

export default app;
