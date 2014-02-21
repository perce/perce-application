( function() {
  var indexApp = angular.module( 'indexApp', [
    'ngRoute'
  ]);

  indexApp.config( [ '$routeProvider','$locationProvider',
    function( $routeProvider, $locationProvider ) {
      $routeProvider
        .when( '/', {
          templateUrl : 'views/index/home.html',
        } )
        .when( '/howitworks', {
          templateUrl : 'views/index/howitworks.html',
        } )
        .when( '/features', {
          templateUrl : 'views/index/features.html',
        } )
        .when( '/whoweare', {
          templateUrl : 'views/index/whoweare.html',
        } )
        .when( '/contact', {
          templateUrl : 'views/index/contact.html',
        } )
        .when( '/user', {
          templateUrl : 'views/index/user.html'
        } )
        .when( '/login', {
          templateUrl : 'views/index/login.html',
          controller  : 'LoginController'
        } )
        .otherwise( {
          redirectTo: '/'
        } );

        $locationProvider.html5Mode(true);

    } ] );

  indexApp.controller( 'LoginController', function( $scope, $http ) {
    $scope.submit = function() {
      console.log( $scope );
    };
  } );
} )( angular );
