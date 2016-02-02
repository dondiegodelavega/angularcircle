'use strict';

/**
 * @ngdoc overview1
 * @name myAppApp
 * @description
 * # myAppApp
 *
 * Main module of the application.
 */
angular
  .module('myAppApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'rzModule'
  ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider ,$locationProvider) {
      $routeProvider
          .when('/template1', {
              templateUrl: 'views/template1.html',
              controller: 'templateCtrl',
              templateName: 'template1'
          })
          .when('/template2', {
              templateUrl: 'views/template2.html',
              controller: 'templateCtrl',
              templateName: 'template2'
          })
          .when('/template3', {
              templateUrl: 'views/template3.html',
              controller: 'templateCtrl',
              templateName: 'template3'
          })
          .otherwise({
              redirectTo: '/template1'
          });

        $locationProvider.html5Mode(true);

    }]);

