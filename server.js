import express from "express";
import clipboard from "clipboardy";

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    return res.send('Welcome to the server');
});

app.use((req, res, next) => {
    const key = req.header("x-api-key");

    if (!key || key !== "test-key") {
        return res.status(401)
            .send({message: "Invalid or missing key"});
    }

    return next();
});

app.get('/clipboard', async (req, res) => {
    res.send({text: await clipboard.read()});
});

app.post('/clipboard', async (req, res) => {
    const {text} = req.body;

    await clipboard.write(text);

    res.send("OK");
});

app.listen(52741, "0.0.0.0", () => {
    console.log("Server started at http://localhost:52741");
});