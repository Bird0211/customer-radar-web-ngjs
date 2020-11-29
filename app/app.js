/**
 * my app module
 */
var app = angular.module("myapp", ['ngRoute','oc.lazyLoad']);

/**
 * <app-header> directive
 */
app.directive("appHeader", function () {
    return {
        restrict: "E",
        scope: {
        },
        templateUrl:"app/components/header/header.html"
    }
});

/**
 * myApp config
 * route default to user page
 */
app.config(['$routeProvider',function($routeProvider){    
    $routeProvider
        .when('/user', {
            url: "/user",
            templateUrl: 'app/components/user/user.html',
            resolve: {
                loadMyCtrl:['$ocLazyLoad',function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                                name:"userApp",
                                files:[
                                    "app/components/user/user.js",
                                    'app/service/userService.js'
                                ]
                            })
                    }]
            }
        })
        .when('/',{redirectTo:'/user'})
        .otherwise({redirectTo:'/'});
}]);

app.controller("myCtrl", function($scope) {
    
});
