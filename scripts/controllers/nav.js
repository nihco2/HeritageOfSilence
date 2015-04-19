'use strict';
var NavCtrl = function ($scope, $factory) {
  var promise = $factory.getEpisodes();
  var navMain = $("#nav-main");

  promise.then(function (data) {
    $scope.episodes = data.episodes;
    $scope.reperes = data.reperes;
  }).catch(function (err) {
    console.log(err);
  });

  $scope.onMouseOver = function (evt) {
    $(evt.currentTarget).find('img').toggleClass('hidden');
  }

  $scope.onMouseLeave = function (evt) {
    $(evt.currentTarget).find('img').toggleClass('hidden');
  }

  $scope.expand = function () {
    $('#nav-main').toggleClass('expand');
  }

  $scope.switchMenu = function (evt) {
    if ($(evt.currentTarget).data('menu') === 'reperes') {
      $('[data-menu="episodes"]').removeClass('active');
      $('.reperes-responsive').removeClass('hidden');
      $('.vignettes').addClass('hidden');
    } else {
      $('[data-menu="reperes"]').removeClass('active');
      $('.reperes-responsive').addClass('hidden');
      $('.vignettes').removeClass('hidden');
    }
    $(evt.currentTarget).addClass('active');
  }
}
module.exports = NavCtrl;
