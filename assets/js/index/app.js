( function() {
  var indexApp = angular.module( 'indexApp', [
    'ngRoute',
    'myAppControllers'
  ]);

  indexApp.config( [ '$routeProvider','$locationProvider',
    function( $routeProvider, $locationProvider ) {
      $routeProvider
        .when( '/home', {
          templateUrl : 'views/home.html',
          controller  : 'MyAppController'
        } )
        .when( '/howitworks', {
          templateUrl : 'views/howitworks.html',
          controller  : 'MyAppController'
        } )
        .when( '/features', {
          templateUrl : 'views/features.html',
          controller  : 'MyAppController'
        } )
        .when( '/whoWeAre', {
          templateUrl : 'views/whoWeAre.html',
          controller  : 'MyAppController'
        } )
        .when( '/contact', {
          templateUrl : 'views/contact.html',
          controller  : 'MyAppController'
        } )
        .otherwise( {
          redirectTo: '/'
        } );

        $locationProvider.html5Mode(true);

    } ] );

  indexApp.controller( 'whatever', function $scope () {
    $scope.message = 'yeah';
  } );
} )( angular );
