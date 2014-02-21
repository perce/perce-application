( function() {
  var indexApp = angular.module( 'indexApp', [
    'ngRoute'
  ]);


  indexApp.factory('httpRequestInterceptor', function () {
    return {
      request: function (config) {
        config.headers['perce-ajax'] = 'true';
        console.log( 'header ', config.headers );
        return config;
      }
    };
  });

  indexApp.config( [ '$routeProvider','$locationProvider', '$httpProvider',
    function AppConfig( $routeProvider, $locationProvider, $httpProvider ) {

      $routeProvider
        .when( '/', {
          templateUrl : 'views/index/home.html',
        } )
        .when( '/howitworks', {
          templateUrl : 'views/index/howitworks.html',
        } )
        .when( '/features', {
          templateUrl : 'dashboard/index.html',
        } )
        .when( '/whoweare', {
          templateUrl : 'views/index/whoweare.html',
        } )
        .when( '/contact', {
          templateUrl : 'views/index/contact.html',
        } )
        .when( '/user', {
          templateUrl : 'views/index/user.html',
          controller  : 'CreateUserController'
        } )
        .when( '/login', {
          templateUrl : 'views/index/login.html',
          controller  : 'LoginController'
        } )
        .otherwise( {
          redirectTo: '/'
        } );

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('httpRequestInterceptor');

    } ] );

  indexApp.controller( 'LoginController', function( $scope, $http ) {
    console.log( 'LoginController() ' );

    $scope.submit = function() {
      console.log( 'LoginController() ', $scope );

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



  indexApp.controller( 'CreateUserController', function( $scope, $http ) {
    console.log( 'CreateUserController() ' );

    $scope.submit = function( event ) {
      console.log( 'CreateUserController() ', $scope );

      $http.post( '/user', $scope.data )
          .success( function( data ){
            console.log( 'create user success! ', data );
            if ( data.url ){
              document.location = data.url;
            }
          } )
          .error( function( data ){
            console.warn( 'oh nooooooo :( create user error! ', data );
            if( data.error ) {
              $scope.errorMessage = data.error;
            }
          } );
    };
  } );
} )( angular );
