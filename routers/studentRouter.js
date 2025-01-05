const express = require('express');
const fs = require('fs');
const path = "./students.json";

if (!fs.existsSync(path)){
    fs.writeFileSync(path, '[]', (err) => {
        if (err) {
            console.log("Error in initialize file students.json", err)
        } else {
            console.log("students.json is successfully initialized.")
        }
    })
}

const studentRouter = express.Router()

studentRouter.get('/students', (req, res) => {
    fs.readFile(path, "utf-8", (err, students)=> {
        if (err){
            res.send({'msg': "Error in Reading file."})
        } else {
            let parsedStudents = JSON.parse(students);
            res.send({'msg': "This is required data.", students: parsedStudents});
        }
    });
});

studentRouter.post("/students", (req, res)=> {
    fs.readFile(path, "utf-8", (err, students) => {
        if (err) {
            res.send({'msg': "Error in reading file."})
        } else {
            let parsedStudents = JSON.parse(students) || [];
            let newStudent = req.body;
            parsedStudents.push(newStudent);
            fs.writeFile(path, JSON.stringify(parsedStudents), (err) => {
                if (err) {
                    res.send({'msg': "Unable to add student"})
                } else {
                    res.send({'msg': "Student added successfully"})
                }
            })
        }
    })
})

studentRouter.get("/students/:id", (req, res) => {
    const { id } = req.params;

    fs.readFile(path, "utf-8", (err, students) => {
        if (err) {
            res.send("Error in reading file.", err);
        } else {
            let parsedStudents = JSON.parse(students);
            let student = parsedStudents.filter(student => student.id === parseInt(id));

            if (student) {
                res.send({ 'msg': "Student found.", data: student });
            } else {
                res.status(404).send({ 'msg': `Student with id ${id} not found.` });
            }
        }
    })
})

studentRouter.patch("/students/:id", (req, res) => {
    const upadatedStudent = req.body;
    const id = parseInt(req.params.id);

    fs.readFile(path, "utf-8", (err, students) => {
        if (err) {
            res.send("Can't read file.")
        } else {
            let parsedStudents = JSON.parse(students);
            let index = parsedStudents.findIndex(student => student.id === id);

            if (index === -1) {
                res.send({'msg': "Data with this id not found"})
            } else {
                parsedStudents[index] = {...parsedStudents[index], ...upadatedStudent};
                fs.writeFile(path, JSON.stringify(parsedStudents), (err) => {
                    if (err) {
                        res.send({'msg': "Error in updating data."})
                    } else {
                        res.send({'msg': "Data updated successfully", data: parsedStudents[index]})
                    }
                })
            }
        }
    })
})

studentRouter.delete("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile(path, "utf-8", (err, students) => {
        if (err) {
            res.send("Can't read file.")
        } else {
            let parsedStudents = JSON.parse(students);
            let filteredStudent = parsedStudents.filter(item => item.id !== id);
            if (filteredStudent.length === parsedStudents.length) {
                res.send({'msg': "Student with this id not found"})
            } else {
                fs.writeFile(path, JSON.stringify(filteredStudent), (err) => {
                    if (err) {
                        res.send({'msg': "Error in updating data."})
                    } else {
                        res.send({'msg': "Student deleted successfully"})
                    }
                })
            }
        }
    })
})

module.exports = {studentRouter}