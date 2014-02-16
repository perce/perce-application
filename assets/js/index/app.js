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
          templateUrl : 'views/index/login.html'
        } )
        .otherwise( {
          redirectTo: '/'
        } );

        $locationProvider.html5Mode(true);

    } ] );

} )( angular );
