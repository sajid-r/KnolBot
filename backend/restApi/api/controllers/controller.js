'use strict';


var mongoose = require('mongoose'),
  User = mongoose.model('user'),
  Course = mongoose.model('course'),
  Admin = mongoose.model('admin'),
  Invol = mongoose.model('involvement');

                //////////////////
                //  RETRIEVE    //
                //////////////////

exports.getUser = function(req,res) {
  User.find({"userid":req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getCourse = function(req,res) {
  Course.find({"courseid":req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getAllCourses = function(req,res) {
  Course.find({}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getAdmin = function(req,res) {
  Admin.find({"adminid":req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getInvol = function(req,res) {
  Invol.find({"involvementno":req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

                //////////////////
                //    CREATE    //
                //////////////////

exports.postUser = function(req,res) {
  console.log(req.body.body);
  var newuser = new User(JSON.parse(req.body.body));
  newuser.save(function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.postCourse = function(req,res) {
  console.log(req.body.body);
  var newcourse = new Course(JSON.parse(req.body.body));
  newcourse.save(function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.postAdmin = function(req,res) {
  console.log(req.body.body);
  var newadmin = new Admin(JSON.parse(req.body.body));
  newadmin.save(function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.postInvol = function(req,res) {
  console.log(req.body.body);
  var newinvol = new Invol(JSON.parse(req.body.body));
  newinvol.save(function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

                //////////////////
                //    UPDATE    //
                //////////////////


exports.updateUser = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'userid':queryid.userid};
  var newobj = JSON.parse(req.body.body);
  User.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.updateAdmin = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'adminid':queryid.adminid};
  var newobj = JSON.parse(req.body.body);
  Admin.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.updateCourse = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'courseid':queryid.courseid};
  var newobj = JSON.parse(req.body.body);
  Course.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.updateInvol = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'involvementno':queryid.involvementno};
  var newobj = JSON.parse(req.body.body);
  Invol.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};