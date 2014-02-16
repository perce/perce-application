( function() {
  var indexApp = angular.module( 'indexApp', [
    'ngRoute'
  ]);

  indexApp.config( [ '$routeProvider',
    function( $routeProvider ) {
      $routeProvider
        .when( '/', {
          templateUrl : 'public/views/index.html',
          controller  : 'whatever'
        } )
        .when( '/howitworks', {
          templateUrl : 'public/views/howItWorks.html',
          controller  : 'whatever'
        } )
        // .when( '/features', {
        //   templateUrl : 'partials/phone-detail.html',
        //   controller  : 'PhoneDetailCtrl'
        // } )
        // .when( '/whoWeAre', {
        //   templateUrl : 'partials/phone-detail.html',
        //   controller  : 'PhoneDetailCtrl'
        // } )
        // .when( '/contact', {
        //   templateUrl : 'partials/phone-detail.html',
        //   controller  : 'PhoneDetailCtrl'
        // } )
        // .otherwise( {
        //   redirectTo: '/'
        // } );
    } ] );

  indexApp.controller( 'whatever', function $scope () {
    $scope.message = 'yeah';
  } );
} )( angular );
