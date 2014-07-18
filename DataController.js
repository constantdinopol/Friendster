/**
 * Created by intelligrape on 11/7/14.
 */
// create the module and name it scotchApp
var fbApp = angular.module('fbApp', ['ngRoute']);




// configure our routes
fbApp.config(function($routeProvider) {
    $routeProvider

       /* // route for the home page
        .when('/index', {
            templateUrl : 'index.html',
            controller  : 'mainController'
        })*/


        .when('/', {
            templateUrl : 'Home.html',
            controller  : 'mainController'
        })
        .when('/Home', {
            templateUrl : 'Home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/Profile', {
            templateUrl : 'Profile.html',
            controller  : 'mainController'
        })

        // route for the contact page
        .when('/Friend', {
            templateUrl : 'Friend.html',
            controller  : 'mainController'
        });
});

// create the controller and inject Angular's $scope
fbApp.controller('mainController',['$scope', '$http',function($scope,$http) {

    // create a message to display in our view
    $http.get('http://localhost:3000/user').success(function (data) {

        $scope.firstName = data[0].firstName;
        $scope.secondName = data[0].lastName;
        var fullName = $scope.firstName;
        if($scope.secondName != undefined &&  $scope.secondName != ""){
            fullName += data[0].lastName;
        }
        $scope.userName = fullName;
        $scope.userEmailId = data[0].email;
        $scope.gender = data[0].gender;
        $scope.dateOfBirth = data[0].dateOfBirth;
        $scope.pics = data[0].pics;
        $scope.friends = data[0].friends;


    });

}]) ;


// create the controller and inject Angular's $scope
fbApp.controller('profileController', ['$scope', '$http',function($scope,$http) {


    $scope.userName = "";
    $scope.userPhone = "";
    $scope.userEmail = "";

    // create a message to display in our view
    $scope.userList = [];
    $scope.cancelUserData = function (){
        $scope.userName = "";
        $scope.userPhone = "";
        $scope.userEmail = "";
        $scope.$apply();
    }

    $scope.submitUserData = function (){
        console.log('in addition...');
        if($scope.userName != "" &&  $scope.userPhone != "" && $scope.userEmail != ""){
            var userData = {
                id:'1001',
                name:'User 1',
                phone:'9654173324',
                email:'rubisaini2009@gmail.com'

            }
            console.log(userData);
            $http.post('http://localhost:3000/user/', userData).success(function (data) {

                $scope.userList.push({
                    name:$scope.userName,
                    phone:$scope.userPhone,
                    email:$scope.userEmail
                });
                $scope.userName = "";
                $scope.userPhone = "";
                $scope.userEmail = "";
                $scope.$apply();
            });

           /* $http.get('http://localhost:3000/user/').success(function (data) {
                console.log("-------" + data);
            });*/

        }else {
            alert('Please provide full information');
        }


    }
}]) ;

fbApp.controller('friendController', ['$scope',function($scope) {

    // create a message to display in our view
    $scope.bookList = [];
}]) ;



fbApp.controller('homeController', ['$scope',function($scope) {

    // create a message to display in our view
    $scope.message = 'Home View';
}]) ;
