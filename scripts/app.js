'use strict';

require('jquery');
require('angular');
require('angular-route');
require('angular-sanitize');
require('videogular');
require('videogular-controls');
require('videogular-buffering');
require('videogular-overlay-play');
require('videogular-poster');
require('videogular-youtube');

var MainCtrl = require('./controllers/main');
var NavCtrl = require('./controllers/nav');
var PlayerCtrl = require('./controllers/player');
var FooterCtrl = require('./controllers/footer');
var ModalCtrl = require('./controllers/modal');
var Factory = require('./factory');

angular.module('App', [
    "ngRoute",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.buffering",
    "com.2fdevs.videogular.plugins.poster",
    "info.vietnamcode.nampnq.videogular.plugins.youtube"
  ])
  .config(
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/player/:episode', {
          templateUrl: 'views/player.html',
          controller: 'PlayerCtrl'
        })
        .when('/whoarethey', {
          templateUrl: 'views/whoarethey.html',
          controller: 'ModalCtrl'
        })
        .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'ModalCtrl'
        })
        .when('/credits', {
          templateUrl: 'views/credits.html',
          controller: 'ModalCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  )
  .factory('Factory', ['$http', '$q', Factory])
  .controller('MainCtrl', ['$scope', '$http', 'Factory', MainCtrl])
  .controller('NavCtrl', ['$scope', 'Factory', NavCtrl])
  .controller('FooterCtrl', ['$scope', 'Factory', FooterCtrl])
  .controller('ModalCtrl', ['$scope', 'Factory', ModalCtrl])
  .controller('PlayerCtrl', ['$scope', '$sce', '$routeParams', 'Factory', PlayerCtrl])
  .filter('unsafe', function ($sce) {
    return function (val) {
      return $sce.trustAsHtml(val);
    };
  });
