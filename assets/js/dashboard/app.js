var perce = perce || {};

( function( ng, perce ) {
  perce.dashboardApp = angular.module( 'beastApp', [
    'ngRoute'
  ]);


  perce.dashboardApp.factory('httpRequestInterceptor', function () {
    return {
      request: function (config) {
        config.headers['perce-ajax'] = 'true';
        console.log( 'header ', config.headers );
        return config;
      }
    };
  })

  .config( [ '$routeProvider','$locationProvider', '$httpProvider',
    function AppConfig( $routeProvider, $locationProvider, $httpProvider ) {

      $routeProvider
        .when( '/dashboard', {
          templateUrl : 'views/beast/partials/home.html',
        } )
        .when( '/account', {
          templateUrl : 'views/beast/partials/account.html',
        } )
        .when( '/projects', {
          templateUrl : 'views/beast/partials/projects.html',
        } )
        .otherwise( {
          redirectTo: '/'
        } );

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('httpRequestInterceptor');

    } ] );

  perce.dashboardApp.controller( 'AccountController', function( $scope, $http ) {
    console.log( 'AccountController() ' );

    $scope.submit = function() {
      console.log( 'AccountController() ', $scope );

      $http.post( '/login', $scope.data )
          .success( function( data ){
            console.log( 'login success! ', data );
            if ( data.url ){
              document.location = data.url;
            }
          } )
          .error( function( data ){
            console.warn( 'oh nooooooo :( login error! ', data );
            if( data.error ) {
              $scope.errorMessage = data.error;
            }
          } );
    };
  } );

} )( angular, perce );
