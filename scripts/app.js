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
    function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/player', {
          templateUrl: 'views/player.html',
          controller: 'PlayerCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  )
  .factory('Factory', ['$http', '$q', Factory])
  .controller('MainCtrl', ['$scope', '$http', 'Factory', MainCtrl])
  .controller('NavCtrl', ['$scope', '$sce', NavCtrl])
  .controller('FooterCtrl', ['$scope', 'Factory', FooterCtrl])
  .controller('PlayerCtrl', ['$scope', '$sce', PlayerCtrl]);
