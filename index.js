import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./static'));

app.get('/events', (req, res) => {
    // Send the SSE header.
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    // Sends an event to the client where the data is the current date,
    // then schedules the event to happen again after 5 seconds.
    const sendEvent = () => {
        const data = (new Date()).toLocaleTimeString();
        res.write("data: " + data + '\n\n');
        setTimeout(sendEvent, 5000)
    }
    sendEvent();
})

app.post('/download', function (req, res) {
    const filename = req.body.filename;
    console.log()
    const filepath = path.join(process.cwd(), './static', filename);
    const content = fs.readFileSync(filepath);

    res.setHeader("Content-Type", 'application/octet-stream')
    res.setHeader('Content-Disposition', 'attachment;filename=' + filename);
    res.send(content);
})



app.listen(3000, () => {console.log('http://localhost:3000')})