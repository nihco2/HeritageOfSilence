'use strict';
var MainCtrl = function ($scope, $http, $factory) {
  angular.element(document).ready(function () {
    angular.element('footer').fadeIn();
    angular.element('header').addClass('hidden');
  });
}

module.exports = MainCtrl;
