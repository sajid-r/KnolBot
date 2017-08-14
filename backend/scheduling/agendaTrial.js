var cron = require('node-cron');
 
cron.schedule('*/3 * * * * *', function(){
  console.log('running every minute 1, 2, 4 and 5');
});