import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory store for chat messages
const messages: any[] = [];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    maxHttpBufferSize: 1e7 // Increase to 10MB for photo/video uploads
  });

  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "GroundPro" });
  });

  // Socket.io Logic
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Send history
    socket.emit("chat:history", messages.slice(-50));

    socket.on("chat:message", (msg) => {
      const messageWithId = {
        ...msg,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        reactions: {}
      };
      messages.push(messageWithId);
      if (messages.length > 200) messages.shift(); // Keep last 200
      
      io.emit("chat:message", messageWithId);
    });

    socket.on("chat:reaction", ({ messageId, emoji }) => {
      const msg = messages.find(m => m.id === messageId);
      if (msg) {
        if (!msg.reactions) msg.reactions = {};
        msg.reactions[emoji] = (msg.reactions[emoji] || 0) + 1;
        io.emit("chat:reaction", { messageId, reactions: msg.reactions });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`GroundPro server running on http://localhost:${PORT}`);
  });
}

startServer();
