const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const { studentRouter } = require('./routers/studentRouter')
const { classRouter } = require('./routers/classRouter');

app = express();

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan(':method :status :res[content-length] - :response-time ms :date[iso] HTTP/:http-version :url', { stream: logStream }));

app.use(express.json());

app.use("/api", studentRouter);

app.use("/api", classRouter);

app.listen(3000, () => {
    console.log("Server is running at 3000")
})
