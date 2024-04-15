const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const initial_path = path.join(__dirname, 'public');

app.use(express.static (initial_path));

app.get('/', (req,res) => {
    res.sendFile(path.join(initial_path, 'index.html'));
})

app.use((req,res)=>{
    res.json("404");
})

app.listen(port, ()=>{
    console.log("listening.........");
})