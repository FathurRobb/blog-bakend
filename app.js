const express = require('express');
const connect = require('./schemas');
const { postsRouter, commentsRouter } = require('./routes');
connect();
const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', [postsRouter, commentsRouter]);

app.listen(port, () => {
    console.log(port, 'Server is open with port!');
})