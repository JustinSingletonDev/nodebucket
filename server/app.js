/*
============================================
; Title:  app.js
; Author: Justin Singleton
; Date:   12 March 2020
; Description: File for the server side
; logic and APIs.
;===========================================
*/

/**
 * Require statements
 */
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Employee = require("./models/employee");

/**
 * App configurations
 */
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

/**
 * Variables
 */
const port = process.env.PORT || '3000';

const conn = "mongodb+srv://Friend0fMisery:Kool6767!@buwebdev-cluster-1-sn3vf.mongodb.net/nodebucket?retryWrites=true&w=majority";

/**
 * Database connection
 */
mongoose.connect(conn, {
  promiseLibrary: require('bluebird'),
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.debug(`Connection to the database instance was successful`);
}).catch(err => {
  console.log(`MongoDB Error: ${err.message}`)
}); // end mongoose connection

/**
 * API(s)
 */

// Find Employee by ID
app.get("/api/employees/:empId", async function(req, res) {
  Employee.findOne({empId: req.params.empId}, function(err, employee) {
    if(err) {
      console.log(err)
      return next(err)
    } else {
      console.log(employee)
      res.json(employee)
    };
  });
});

// Find all tasks of an Employee
app.get("/api/employees/:empId/tasks", function(req, res, next) {
  Employee.findOne({empId: req.params.empId}, 'empId todo done', function(err, employee) {
    if(err) {
      console.log(err)
      return next(err)
    } else {
      console.log(employee)
      res.json(employee)
    };
  });

});

// Create a task for an Employee
app.post("/api/employees/:empId/tasks", function(req, res, next) {
  Employee.findOne({empId: req.params.empId}, function(err, employee) {
    if(err) {
      console.log(err)
      return next(err)
    } else {
      const item = {
        text: req.body.text
      };

      employee.todo.push(item);
      employee.save(function(err, employee) {
        if(err) {
          console.log(err)
          return(err)
        } else {
          console.log(employee)
          res.json(employee)
        }
      });
    };
  });
});

// Edit a task for an Employee
app.put('/api/employees/:empId/tasks/', function(req, res, next) {
  Employee.findOne({empId: req.params.empId }, function(err, employee) {
    if (err) {
      console.log(err);
      return next(err)
    } else {
      employee.set({
        'todo': req.body.todo,
        'done': req.body.done
      });

      employee.save(function(err, data) {
        if (err) {
          res.status(500).json(error);
        } else {
          res.status(200).json(data);
        }
      });
    }
  });
});

// Delete a task for an Employee
app.delete("/api/employees/:empId/tasks/:taskId", function(req, res, next) {
  Employee.findOne({empId: req.params.empId}, function(err, employee) {
    if(err) {
      console.log(err)
      return next(err)
    } else {

      const todoItem = employee.todo.find(
        item => item._id.toString() === req.params.taskId
      );
      const doneItem = employee.done.find(
        item => item._id.toString() === req.params.taskId
      );

      if(todoItem) {

        employee.todo.id(todoItem._id).remove();
        employee.save(function(err, emp1) {

          if(err) {
            console.log(err)
            return(err)
          } else {
            console.log(emp1)
            res.json(emp1)
          }
        });
      } else if(doneItem) {

        employee.done.id(doneItem._id).remove();
        employee.save(function(err, emp2) {

          if(err) {
            console.log(err)
            return(err)
          } else {
            console.log(emp2)
            res.json(emp2)
          }
        });
      } else {
        console.log('Unable to locate task: ${req.params.taskId}');
        res.status(200).send({
          'type': 'warning',
          'text': 'Unable to locate task: ${req.params.taskId}'
        })
      }
    }
  })
});


/**
 * Create and start server
 */
http.createServer(app).listen(port, function() {
  console.log(`Application started and listening on port: ${port}`)
}); // end http create server function
