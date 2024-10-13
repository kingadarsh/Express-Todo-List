


const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());


TodoList=[];

// Pushing the content to the list
app.post("/", (req, res) => {
    const content = req.body.content;
    const lineNumber = TodoList.length + 1;
    const todo = `${lineNumber}. ${content}\n`;

    TodoList.push(todo);

    fs.appendFile("a.txt", todo, (err) => {
        if (err) {
            return res.status(500).send("There was an error writing to the file.");
        }
        res.send(`Successfully added todo with line number ${lineNumber}`);
    });
});


// Getting the content from the list
app.get("/",(req,res)=>{
    fs.readFile("a.txt","utf-8",(err,data)=>{
        if(err){
            res.send("There was an issue reading the file");
        }
        res.send(data);
    })
})

//Put -> Update the contents based on lines 
app.put("/:linenumber",(req,res)=>{
    const linenumber = parseInt(req.params.linenumber);
    const newcontent = req.body.newcontent;

    fs.readFile("a.txt","utf-8",(err,data)=>{
        if(err){
            res.send("There was an Error");
        }
        const lines = data.split("\n");

        if(linenumber>lines.length){
            res.send("Line does not exist");
        }
        
        lines[linenumber-1]=`${linenumber}. ${newcontent}`;

        const updatedtodo=lines.join("\n");

        fs.writeFile("a.txt",updatedtodo,(err)=>{
            if(err){
                res.send("Error from read -> write from put");
            }
            res.send("Successfully Updated");
        });

    });
    
});

// Delete the todo by line number 
app.delete("/:lineNumber", (req, res) => {
    const lineNumber = parseInt(req.params.lineNumber);

    fs.readFile("a.txt", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).send("There was an error reading the file.");
        }

        let lines = data.split("\n"); // Split the file content into lines
        if (lineNumber > lines.length || lineNumber <= 0) {
            return res.status(400).send("Invalid line number.");
        }

        // Remove the specific line
        lines.splice(lineNumber - 1, 1);

        // Reassign line numbers for all subsequent lines
        lines = lines.map((line, index) => {
            if (line.trim() !== "") {
                return `${index + 1}. ${line.split('. ')[1]}`;
            }
            return "";
        });

        // Join the lines back together and rewrite the file
        const updatedContent = lines.join("\n").trim();
        fs.writeFile("a.txt", updatedContent + '\n', (err) => {
            if (err) {
                return res.status(500).send("There was an error deleting the to-do.");
            }
            res.send(`Todo at line number ${lineNumber} deleted successfully.`);
        });
    });
});

        
app.listen(3000,()=>{
    console.log("Serving on port 3000")
    
});
