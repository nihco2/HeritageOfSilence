'use strict';
var ModalCtrl = function ($scope, $factory) {
  angular.element(document).ready(function () {
    angular.element('footer').fadeOut();
    angular.element('header').removeClass('hidden');
  });
}
module.exports = ModalCtrl;
