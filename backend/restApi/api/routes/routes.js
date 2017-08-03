'use strict';
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

  app.route('/admin/:id')
    .get(controller.getAdmin);



  app.route('/user/create').
  	post(controller.postUser);

  app.route('/admin/create').
  	post(controller.postAdmin);

  app.route('/course/create').
  	post(controller.postCourse);

  app.route('/invol/create').
  	post(controller.postInvol);



  app.route('/user/update').
  	post(controller.updateUser);

  app.route('/admin/update').
  	post(controller.updateAdmin);

  app.route('/course/update').
  	post(controller.updateCourse);

  app.route('/invol/update').
  	post(controller.updateInvol);
};