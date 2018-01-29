const express = require('express')

const app = express()

app.use(express.static('out'));

console.log('http://localhost:8080');

app.listen(8080);