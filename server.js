import express from "express";
import clipboard from "clipboardy";
import {Bonjour} from "bonjour-service";
import cors from "cors";

const PORT = 52741;
const app = express();
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY is missing in .env file");
    process.exit(1);
}

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    const requestInfo = {
        ip: req.ip || req.socket.remoteAddress,
        method: req.method,
        url: req.originalUrl,
        time: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
    };

    console.log(requestInfo);

    next();
});

app.get('/', async (req, res) => {
    return res.send('Welcome to the server');
});

app.use((req, res, next) => {
    const key = req.header("x-api-key");

    if (!key || key !== API_KEY) {
        return res.status(401)
            .send({message: "Invalid or missing key"});
    }

    return next();
});

app.get('/clipboard', async (req, res) => {
    res.send(await clipboard.read());
});

app.post('/clipboard', async (req, res) => {
    const {text} = req.body;

    await clipboard.write(text);

    res.send("OK");
});

app.listen(52741, "0.0.0.0", () => {
    console.log("Server started at http://localhost:52741");

    const bonjour = new Bonjour();

    bonjour.publish({
        name: "Zunaid PC",
        type: "clipboard",
        protocol: "tcp",
        port: PORT
    });

    console.log("Clipboard service advertised on LAN");
});