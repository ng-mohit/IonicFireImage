// Ionic Starter App
var fb = new Firebase("https://sharing-image.firebaseio.com/");
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var imageApp = angular.module('starter', ['ionic', 'ngCordova','firebase']);

imageApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

imageApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("firebase", {
            url: "/firebase",
            templateUrl: "templates/firebase.html",
            controller: "FirebaseController",
            cache: false
        })
        .state("secure", {
            url: "/secure",
            templateUrl: "templates/secure.html",
            controller: "SecureController"
        });
    $urlRouterProvider.otherwise('/firebase');
});

imageApp.controller("FirebaseController", function($scope, $state, $firebaseAuth) {

    var fbAuth = $firebaseAuth(fb);

    $scope.login = function(username, password) {
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go("secure");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function(username, password) {
        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $state.go("secure");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

})

imageApp.controller("SecureController", function($scope, $ionicHistory, $firebaseArray, $cordovaCamera) {

    $ionicHistory.clearHistory();

    $scope.images = [];

    var fbAuth = fb.getAuth();
    if(fbAuth) {
        var userReference = fb.child("users/" + fbAuth.uid);
        var syncArray = $firebaseArray(userReference.child("images"));
        $scope.images = syncArray;

        var eventRef = $firebaseArray(fb.child("Events"));
        eventRef.set({
                event1: {
                              heading1:"Wedding",
                              heading2:"JAMES & SARAH",
                              heading3:"December 20, 2015",
                              headingImage:"img/mcfly.jpg",
                              bodyImage:"img/timthumb.jpg",
                              bodyText1:"James Smith & Sarah Higgins",
                              bodyText2:"Request the pleasure of your company to celebrate their Wedding",
                              bodyDate:"Saturday 20th December 2015",
                              bodyAddress1:"Teversal Grange Bar & Restaurant",
                              bodyAddress2:"7:30 pm till late",
                              RSVP1:"17th Ashworth Drive, Notts",
                              RSVP2:"NG17 4QJ"
                          },
                event2: {
                              heading1:"Birthday",
                              heading2:"Olivia",
                              heading3:"July 7,2015",
                              headingImage:"img/amy_jones.jpg",
                              bodyImage:"img/Birthdaycelebration.jpg",
                              bodyText1:"Olivia",
                              bodyText2:"Would like to invite you to her 23rd Birthday Celebration",
                              bodyDate:"Monday, 7th July 2015",
                              bodyAddress1:"The Sheraton hotel, Hardwick",
                              bodyAddress2:"8:15 pm onwards",
                              RSVP1:"07983503924",
                              RSVP2:""
                          },
                event3:
                          {
                              heading1:"Picnic",
                              heading2:"Worlock Family",
                              heading3:"June 24, 2015",
                              headingImage:"img/UKGuy1.jpg",
                              bodyImage:"img/picnic.jpg",
                              bodyText1:"Join us for a family picnic with games, food and fun",
                              bodyDate:"Sunday, June 24th",
                              bodyAddress1:"green park, 20 main street, nashville, tennessee",
                              bodyAddress2:"2:00 pm to 4:00 pm",
                              RSVP1:"Adam at 213.482.2145",
                              RSVP2:"By June 15th"
                          }
        })
    } else {
        $state.go("firebase");
    }

    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: true
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            syncArray.$add({image: imageData}).then(function() {
                alert("Image has been uploaded");
            });
        }, function(error) {
            console.error(error);
        });
    }

});
