import express from "express";
import ErrorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes import
import vendor from "./routes/vendor/vendor.js";
import artist from "./routes/artist/artist.js";
import decorator from "./routes/decorator/decorator.js";
import photographer from "./routes/photographer/photographer.js";
import sound from "./routes/sound/sound.js";

app.get("/", (req, res) => res.send("Server is working"));

let baseUrl = "/api/event-management/v1";

app.use(`${baseUrl}/vendor`, vendor);
app.use(`${baseUrl}/artist`, artist);
app.use(`${baseUrl}/decorator`, decorator);
app.use(`${baseUrl}/photographer`, photographer);
app.use(`${baseUrl}/sound`, sound);

// Middlewares for errors
app.use(ErrorMiddleware);

export default app;
