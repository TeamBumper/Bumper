getCars();

function getCars(){
    endpoint = '/search';
    endpoint += '?make=Chevrolet'
    makeRec('GET', endpoint, handleCars);
}

function handleCars(response) {
    console.log(response.responseText);
}

/* AJAX Boilerplate */
function makeRec(method, target, handlerAction, data) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onreadystatechange = function() {
    if(httpRequest.readyState === XMLHttpRequest.DONE) {
        console.log("DONEDONEDONE");
        handlerAction(httpRequest);
    }
    }
    httpRequest.open(method, target);

    if (data) {
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(data);
    }
    else {
        httpRequest.send();
    }
  }