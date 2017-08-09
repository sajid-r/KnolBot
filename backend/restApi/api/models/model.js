'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  'userid':Number,
  'username':String,
  'age':Number,
  'organization':String,
  'courses_completed':Array,
  'current_courses':Array
  });

var AdminSchema = new Schema({
  adminid:Number,
  username:String,
  password:String
});

var CourseSchema = new Schema({
  courseid:Number,
  coursetitle:String,
  coursedesc:String,
  datecreated:{
    type:Date,
    default: Date.now
  },
  content:Array
});

var InvolvementSchema = new Schema({
  involvementno:Number,
  userid:Number,
  courseid:Number,
  last_contentid:Number
});

module.exports = mongoose.model('user', UserSchema);
module.exports = mongoose.model('admin', AdminSchema);
module.exports = mongoose.model('course', CourseSchema);
module.exports = mongoose.model('involvement', InvolvementSchema);