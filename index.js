const http = require("http");
const url = require("url");
const fs = require("fs");
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/NodeTodo')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'));

const TodoSchema  = new mongoose.Schema({
    task: String,
})
const Todo = mongoose.model('Todo', TodoSchema)

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;



  if (path === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile("index.html", (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
      }
      res.end(data);
    });
  }



  else if(path == '/add-todo'){
    // console.log(query)
    const newTodo = new Todo({
        task: query.todo
    })
    newTodo.save()
  }


  else if(path == '/get-todo'){

    // let data = Todo.find()
    // console.log(data);
    
    Todo.find().then((todos) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todos))
      // console.log(todos);
      
      })
  }


});

server.listen(3500, () => {
  console.log("server is running on http://localhost:3500");
});
