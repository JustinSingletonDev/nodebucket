/*
============================================
; Title:  employee.js
; Author: Justin Singleton
; Date:   12 March 2020
; Description: File for the Employee database
; model.
;===========================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
  text: {type: String}
})

let EmployeeSchema = new Schema({
  empId: {type: String, unique: true, dropDups: true },
  firstName: {type: String },
  lastName: {type: String },
  todo: [ItemSchema],
  done: [ItemSchema]
});

var Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
