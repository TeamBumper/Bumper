checkUser();
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAM3hjrsZzU2rEjjEAsaY-LebpdS-dDuOA",
    authDomain: "bumper-6a073.firebaseapp.com",
    databaseURL: "https://bumper-6a073.firebaseio.com",
    projectId: "bumper-6a073",
    storageBucket: "bumper-6a073.appspot.com",
    messagingSenderId: "617314005412",
    appId: "1:617314005412:web:76b17eb7cb5474f6929131",
    measurementId: "G-EBKWBZQH2S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            // Record authResult['idToken'] and authResult['accessToken'] to Mongo
            makeRec('POST', '/adduser?email=' + authResult.additionalUserInfo.profile.email + '&access_token=' + authResult.credential.accessToken, nothing);
            localStorage.setItem('email', authResult.additionalUserInfo.profile.email);
            localStorage.setItem('access_token', authResult.credential.accessToken);
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'home',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
};
ui.start('#firebaseui-auth-container', uiConfig);

function checkUser(){
    
  // If localStorage not empty
    // Check if user is authorized
      // If authorized, display their homepage
  // Display login screen
    if ((localStorage.getItem("email") != null) && (localStorage.getItem("access_token") != null)){
        makeRec('GET', '/checkuser?email=' + localStorage.getItem("email") + '&access_token=' +localStorage.getItem("access_token"), handleCheckUser);
    }
}

function openGoogleLogin() {
    var parent = document.getElementById('firebaseui-auth-container');
    console.log("we are here");
    parent.childNodes[0].children[0].childNodes[0].children[0].childNodes[0].childNodes[0].click();
}


function googleSignIn() {
    console.log("here");
    document.getElementById('firebaseui-auth-container').click();
}

function handleCheckUser(response) {
    console.log(response);
    if(response.response.indexOf("200") !== -1) {
        location.href = "home";
    } 
}

function nothing(){}

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