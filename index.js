const express = require('express');
const app = express();
const http = require('http');

let notes = [
  { 
    id: 1,
    content: "HTML is easy",
    important: true
  },
  { id: 2,
    content: "Browser can execute only JavaScript",
    important: false 
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

/*
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(notes));
})
*/

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});