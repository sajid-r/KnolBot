$(".butt").click(getItem);

function getItem() {
    
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:3000/user/1",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "postman-token": "ebcdede0-b69a-7cea-6671-f246d2fbcbea"
      },
      "data": {}
}

$.ajax(settings).done(function (response) {
  var info="";
  console.log(response);
  for (var i=0; i<response.length; i++){
    info += "Hello I am " + response[i].username + ". I am " +
    response[i].age + " years old" + "<br>";
  }
  $(".item").html(info);
});
}