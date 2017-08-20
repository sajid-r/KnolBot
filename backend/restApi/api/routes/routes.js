'use strict';
require('handlebars/runtime');
var handlebars = require('handlebars');
var fs = require('fs');
var express = require("express");
var app = express();


module.exports = function(app) {
  var controller = require('../controllers/controller');

  // controller Routes
  app.route('/user/:id')
    .get(controller.getUser);

  app.route('/course/:id')
    .get(controller.getCourse);

  app.route('/course')
    .get(controller.getAllCourses);

  app.route('/invol/:id')
    .get(controller.getInvol);

  app.route('/invol')
    .get(controller.getAllInvol);

  app.route('/invol/user/:userid')
    .get(controller.getInvolUsingUserID);

  app.route('/admin/:id')
    .get(controller.getAdmin);

  app.route('/content/:courseid/:contentid')
    .get(controller.getContent);

 app.route('/invol/obj/:id')
    .get(controller.getInvolUsingObjID);





  app.route('/user/create').
  	post(controller.postUser);

  app.route('/admin/create').
  	post(controller.postAdmin);

  app.route('/course/create').
  	post(controller.postCourse);

  app.route('/invol/create').
  	post(controller.postInvol); //{"involvementno":10, "courseid":1,"userid":2}






  app.route('/user/update').
  	post(controller.updateUser);

  app.route('/admin/update').
  	post(controller.updateAdmin);

  app.route('/course/update').
  	post(controller.updateCourse);

  app.route('/content/update').
  	post(controller.insertContent);

  app.route('/invol/update').
  	post(controller.updateInvol);

  app.route('/invol/obj/:id').
    post(controller.updateInvolUsingObjID);

                //////////////////
                //    RENDERS   //
                //////////////////

  app.get("/", function(req, res){
    res.sendfile("../../../../interface/index.html");
  });


  app.get("/dashboard", function(req, res){
    res.sendfile("../../../../interface/dashboard.html");
  });
};