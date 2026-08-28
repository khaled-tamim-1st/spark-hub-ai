import express, { type Express } from "express";
import cors from "cors";
import path from "node:path";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import widgetRouter from "./routes/widget.js";
import { logger } from "./lib/logger.js";

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

// Widget Direct & API Routes
app.use("/widget", widgetRouter);
app.use("/api/widget", widgetRouter);
app.use("/api", router);

// Serve static assets (such as widget.js)
const publicDir = path.join(process.cwd(), 'artifacts', 'api-server', 'public');
app.use(express.static(publicDir));

// Serve dashboard static build files (SPA)
const dashboardDist = path.join(process.cwd(), 'artifacts', 'dashboard', 'dist', 'public');
app.use(express.static(dashboardDist));

// Fallback for React Router SPA
app.use((req, res) => {
  const fullUrl = req.originalUrl || req.url || '';
  if (fullUrl.startsWith('/api') || fullUrl.startsWith('/widget') || req.path.startsWith('/api') || req.path.startsWith('/widget')) {
    res.status(404).json({ error: `API route not found: ${req.method} ${fullUrl}` });
    return;
  }
  const indexPath = path.join(dashboardDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.json({ status: "ok", name: "ECOMATE AI API Server", timestamp: new Date() });
    }
  });
});

export default app;
