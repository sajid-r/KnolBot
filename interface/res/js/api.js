$(document).ready(showCourses);

var cardTemplate = $("#course-card-template").detach();

function showCourses(){
    populateCourses();
}

var populateCourses = function() {
    
    var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:3000/course",
  "method": "GET",
  "headers": {
    "content-type": "application/x-www-form-urlencoded",
    "cache-control": "no-cache",
    "postman-token": "47520e8f-a7bd-2549-9e84-9996f0019569"
  },
  "data": {}
}

$.ajax(settings).done(function (response) {
    console.log(response);
    for(var i=0; i<response.length; i++)
        {
            var curItem = cardTemplate.clone();
            curItem.find(".course-name").html(response[i].coursetitle);
            curItem.find(".course-desc").html(response[i].coursedesc);
            curItem.find(".course-card").attr("num",response[i].courseid);
            $(".card-container").append(curItem.clone());  
        }
});
}

var modal = document.getElementById('myModal');


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


function viewModal(){
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}