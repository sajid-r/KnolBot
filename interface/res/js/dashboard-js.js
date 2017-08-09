$(document).ready(showContent);

//var cardTemplate = $("#scrollable-template").detach();

function showContent(){
    populateContent();
}

var populateContent = function() {
    
 var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:3000/course/1",
  "method": "GET",
  "headers": {
    "cache-control": "no-cache",
    "postman-token": "7db05a42-996e-d4ce-22a5-1f780fe6e89e"
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
    for(var i=0; i<response[0].content.length; i++)
        {
            var curItem = cardTemplate.clone();
            curItem.find(".content-desc").html(response[0].content[i].contentdesc);
            curItem.find(".content-link").html(response[0].content[i].link);
            curItem.find("#content-num").html(""+(i+1));
            $(".scrollable-content").append(curItem.clone());  
        }
});
}

function addCourse_submit() {
    var desc = document.getElementById("input-desc").value;
    var link = document.getElementById("input-link").value;
    alert(desc+link);
    document.getElementsByClassName("cf")[0].submit(); //form submission
    var newcontent ={"courseid":1,"contentdesc":desc,"link":link};
    console.log(newcontent);
    var settings2 = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:3000/content/update",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "postman-token": "42af6581-3ab2-712b-9270-92f8631edcee"
      },
      "data": {
        "body": JSON.stringify(newcontent)
      }
    }

    $.ajax(settings2).done(function (response) {
      console.log(response);
    $(".scrollable-content").html="";
        populateContent();
    });
    
}