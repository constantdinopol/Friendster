/**
 * Created by intelligrape on 11/7/14.
 */
// create the module and name it scotchApp
var fbApp = angular.module('fbApp', ['ngRoute']);

// configure our routes
fbApp.config(function ($routeProvider) {
    $routeProvider

        /* // route for the home page
         .when('/index', {
         templateUrl : 'index.html',
         controller  : 'mainController'
         })*/


        .when('/', {
            templateUrl: 'Home.html',
            controller: 'mainController'
        })
        .when('/Home', {
            templateUrl: 'Home.html',
            controller: 'mainController'
        })

        // route for the about page
        .when('/Profile', {
            templateUrl: 'Profile.html',
            controller: 'profileController'
        })

        // route for the contact page
        .when('/Friend', {
            templateUrl: 'Friend.html',
            controller: 'friendController'
        })
        .when('/FriendRequestView', {
            templateUrl: 'FriendRequestView.html',
            controller: 'friendRequestController'
        })
        .when('/MessageView', {
            templateUrl: 'MessageView.html',
            controller: 'messageController'
        });
});

// create the controller and inject Angular's $scope
fbApp.controller('mainController', ['$scope', '$http', function ($scope, $http) {
    $scope.main = {};
    $scope.main.user = {};
    $scope.main.newFriends = [];
    $scope.main.myFriends = [];

    // create a message to display in our view
    $http.get('/user').success(function (data) {
        var fullName = data[0].firstName;
        if (data[0].lastName != undefined && data[0].lastName != "") {
            fullName += " " + data[0].lastName;
        }
        $scope.main.user = {
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            userName: fullName,
            userEmailId: data[0].email,
            gender: data[0].gender,
            dateOfBirth: data[0].dateOfBirth,
            pics: data[0].pics,
            friends: data[0].friends,
            homeTown: data[0].homeTown,
            workedAt: data[0].workedAt,
            school: data[0].school
        }

        if (data[0].friends) {
            if (data[0].friends.length > 0) {
                for (var i = 0; i < data[0].friends.length; i++) {

                    var newFriend = data[0].friends[i];
                    if (newFriend.status == "new") {
                        $scope.main.newFriends.push(newFriend);
                    } else if(newFriend.status == "Accept"){
                        $scope.main.myFriends.push(newFriend);

                    }
                }
            }
        }
        var userProfile = document.getElementById('userProfilePic');
        if ($scope.main.user.gender == "Female") {
            userProfile.src = "img/F_profile.jpeg";
        } else {
            userProfile.src = "img/M_profile.jpeg"
        }
    });

    $scope.logoutUser = function () {
        $http.post('/logout').success(function (data) {
            if (data.status == 1) {
                window.location.href = 'index.html';
            }
        });
    }

}]);


fbApp.controller('profileController', ['$scope', '$http', function ($scope, $http) {
    $scope.editUserProfile = function () {
        console.log('call edit button');
        var editButton = document.getElementById('editBtn');
        var fName = document.getElementById('firstName');
        var lName = document.getElementById('lastName');
        var email = document.getElementById('emailId');
        var homeTown = document.getElementById('homeTown');
        var school = document.getElementById('school');
        var workedAt = document.getElementById('workedAt');
        if (editButton.value == 'Edit') {

            fName.removeAttribute('disabled');
            lName.removeAttribute('disabled');
            email.removeAttribute('disabled');
            homeTown.removeAttribute('disabled');
            school.removeAttribute('disabled');
            workedAt.removeAttribute('disabled');
            editButton.value = 'Save';

        } else {
            var updatedData = {
                firstName: fName.value,
                lastName: lName.value,
                email: email.value,
                homeTown: homeTown.value,
                school: school.value,
                workedAt: workedAt.value

            };
            $http.put('/user', updatedData).success(function (data) {
                if (data.status == 1) {
                    alert('Update User data');
                    fName.setAttribute('disabled', 'disabled');
                    lName.setAttribute('disabled', 'disabled');
                    email.setAttribute('disabled', 'disabled');
                    homeTown.setAttribute('disabled', 'disabled');
                    school.setAttribute('disabled', 'disabled');
                    workedAt.setAttribute('disabled', 'disabled');
                    editButton.value = 'Edit';

                    // create a message to display in our view
                    $http.get('/user').success(function (data) {

                        var fullName = data[0].firstName;
                        if (data[0].lastName != undefined && data[0].lastName != "") {
                            fullName += " " + data[0].lastName;
                        }

                        $scope.main.user = {
                            firstName: data[0].firstName,
                            lastName: data[0].lastName,
                            userName: fullName,
                            userEmailId: data[0].email,
                            gender: data[0].gender,
                            dateOfBirth: data[0].dateOfBirth,
                            pics: data[0].pics,
                            friends: data[0].friends,
                            homeTown: data[0].homeTown,
                            workedAt: data[0].workedAt,
                            school: data[0].school
                        }
                        console.log('user object 2 ', $scope.main.user);

                    });

                } else {
                    alert('Some error occurred to update user data');
                }
            });
        }
    }
}]);


fbApp.controller('friendController', ['$scope', '$http', function ($scope, $http) {
    $scope.friends = [];
    $scope.searchFriend = function () {
        var data =
        {
            value: $('#name').val()
        };
        $http.post('/findFriend', data).success(function (data) {
            var friends = data.friends;
            $scope.friends = [];
            if (friends.length > 0) {
                document.getElementById('searchDivId').removeAttribute('hidden');
                for (var i = 0; i < friends.length; i++) {
                    $scope.friends.push({name: friends[i].firstName, id: friends[i]._id});
                }
            } else {
                document.getElementById('searchDivId').setAttribute('hidden', 'hidden');
            }
        });
    }

    $scope.sendFriendRequest = function (id, name) {
        var data = {
            id: id,
            senderName: $scope.main.user.userName,
            receiverName: name
        };
        $http.post('/sendFriendRequest', data).success(function (data) {
            if (data.status == 1) {
                alert('Send friend request successfully');
            } else {
                alert('Some error occurred to send friend request');

            }
        });
    }
}]);


fbApp.controller('homeController', ['$scope', '$http', function ($scope, $http) {

    // create a message to display in our view
    $scope.postMessage = function () {
        var data = {
            post: $('#postAreaId').val()
        };
        $http.post('/post', data).success(function (data) {
            if (data.status == 1) {
                alert('Your message post successfully');
            } else {
                alert('Some error occurred to post your message');

            }

        });
    }
}]);

fbApp.controller('friendRequestController', ['$scope', '$http', function ($scope, $http) {

    // create a message to display in our view
    $scope.acceptFriendRequest = function (senderId) {
        var data = {
            id: senderId,
            status:"Accept"
        };
        $http.post('/respondFriendRequest', data).success(function (data) {
            if (data.status == 1) {
                alert('You have accept a new friend request');
            } else {
                alert('Some error occurred to accept this friend request');

            }

        });
    }

    // create a message to display in our view
    $scope.rejectFriendRequest = function (senderId) {
        var data = {
            id: senderId,
            status:"Reject"
        };
        $http.post('/respondFriendRequest', data).success(function (data) {
            if (data.status == 1) {
                alert('You have reject a new friend request');
            } else {
                alert('Some error occurred to reject this friend request');

            }

        });
    }
}]);

fbApp.controller('messageController', ['$scope', '$http', function ($scope, $http) {

    // create a message to display in our view
    $scope.postMessage = function () {
        var data = {
            post: $('#postAreaId').val()
        };
        $http.post('/post', data).success(function (data) {
            if (data.status == 1) {
                alert('Your message post successfully');
            } else {
                alert('Some error occurred to post your message');

            }

        });
    }
}]);


