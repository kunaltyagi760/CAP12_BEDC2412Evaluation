const express = require('express');
const fs = require('fs');
const path = "./classes.json";

if (!fs.existsSync(path)){
    fs.writeFileSync(path, '[]', (err) => {
        if (err) {
            console.log("Error in initialize file classes.json", err)
        } else {
            console.log("classes.json is successfully initialized.")
        }
    })
}

const classRouter = express.Router()

classRouter.get('/classes', (req, res) => {
    fs.readFile(path, "utf-8", (err, classes)=> {
        if (err){
            res.send({'msg': "Error in Reading file."})
        } else {
            let parsedClasses = JSON.parse(classes);
            res.send({'msg': "This is required data.", classes: parsedClasses});
        }
    });
});

classRouter.post("/classes", (req, res)=> {
    fs.readFile(path, "utf-8", (err, classes) => {
        if (err) {
            res.send({'msg': "Error in reading file."})
        } else {
            let parsedClasses = JSON.parse(classes) || [];
            let newClass = req.body;
            parsedClasses.push(newClass);
            fs.writeFile(path, JSON.stringify(parsedClasses), (err) => {
                if (err) {
                    res.send({'msg': "Unable to add class"})
                } else {
                    res.send({'msg': "Class added successfully"})
                }
            })
        }
    })
})

classRouter.get("/classes/:id", (req, res) => {
    const { id } = req.params;

    fs.readFile(path, "utf-8", (err, classes) => {
        if (err) {
            res.send("Error in reading file.", err);
        } else {
            let parsedClasses = JSON.parse(classes);
            let filterdClass = parsedClasses.filter(item => item.id === parseInt(id));

            if (filterdClass) {
                res.send({ 'msg': "Class found.", data: filterdClass });
            } else {
                res.status(404).send({ 'msg': `Class with id ${id} not found.` });
            }
        }
    })
})

classRouter.patch("/classes/:id", (req, res) => {
    const upadatedClass = req.body;
    const id = parseInt(req.params.id);

    fs.readFile(path, "utf-8", (err, classes) => {
        if (err) {
            res.send("Can't read file.")
        } else {
            let parsedClasses = JSON.parse(classes);
            let index = parsedClasses.findIndex(item => item.id === id);

            if (index === -1) {
                res.send({'msg': "Data with this id not found"})
            } else {
                parsedClasses[index] = {...parsedClasses[index], ...upadatedClass};
                fs.writeFile(path, JSON.stringify(parsedClasses), (err) => {
                    if (err) {
                        res.send({'msg': "Error in updating data."})
                    } else {
                        res.send({'msg': "Data updated successfully", data: parsedClasses[index]})
                    }
                })
            }
        }
    })
})

classRouter.delete("/classes/:id", (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile(path, "utf-8", (err, classes) => {
        if (err) {
            res.send("Can't read file.")
        } else {
            let parsedClasses = JSON.parse(classes);
            let filteredClasses = parsedClasses.filter(item => item.id !== id);
            if (filteredClasses.length === parsedClasses.length) {
                res.send({'msg': "Class with this id not found"})
            } else {
                fs.writeFile(path, JSON.stringify(filteredClasses), (err) => {
                    if (err) {
                        res.send({'msg': "Error in updating data."})
                    } else {
                        res.send({'msg': "Class deleted successfully"})
                    }
                })
            }
        }
    })
})

module.exports = {classRouter}