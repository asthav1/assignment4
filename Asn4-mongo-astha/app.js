var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Employee = require('./models/employee');
 
 
//get all employee data from db
app.get('/api/employees', async function(req, res) {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/employees/:employee_id', async function(req, res) {
    try {
        const employee = await Employee.findById(req.params.employee_id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.json(employee);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/employees', async function(req, res) {
    try {
        const employee = new Employee({
            name: req.body.name,
            salary: req.body.salary,
            age: req.body.age
        });
        await employee.save();
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});

// create employee and send back all employees after creation



// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', async function(req, res) {
    try {
        // Extract employee ID from request parameters
        let id = req.params.employee_id;

        // Extract updated data from request body
        let data = {
            name: req.body.name,
            salary: req.body.salary,
            age: req.body.age
        };

        // Update the employee record using async/await
        let updatedEmployee = await Employee.findByIdAndUpdate(id, data, { new: true });

        // If the employee is successfully updated, send a success response
        res.send('Successfully updated employee: ' + updatedEmployee.name);
    } catch (error) {
        // If an error occurs during the update process, send an error response
        console.error('Error updating employee:', error);
        res.status(500).send('Error updating employee: ' + error.message);
    }
});


// delete a employee by id

app.delete('/api/employees/:employee_id', async function(req, res) {
    try {
        // Extract employee ID from request parameters
        let id = req.params.employee_id;

        // Delete the employee record using async/await
        let deletedEmployee = await Employee.findByIdAndDelete(id);

        // If the employee is successfully deleted, send a success response
        if (deletedEmployee) {
            res.send('Successfully deleted employee: ' + deletedEmployee.name);
        } else {
            // If the employee with the provided ID is not found, send a 404 status response
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        // If an error occurs during the delete process, send an error response
        console.error('Error deleting employee:', error);
        res.status(500).send('Error deleting employee: ' + error.message);
    }
});

app.listen(port);
console.log("App listening on port : " + port);