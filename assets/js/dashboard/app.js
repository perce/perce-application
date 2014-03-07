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
          templateUrl : 'views/beast/partials/home.html'
        } )
        .when( '/account', {
          templateUrl : 'views/beast/partials/account.html',
          controller  : 'AccountController'
        } )
        .when( '/projects', {
          templateUrl : 'views/beast/partials/projects.html',
          controller  : 'ProjectController'
        } )
        .otherwise( {
          redirectTo: '/'
        } );

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('httpRequestInterceptor');

    } ] )

  .controller( 'AccountController', function( $scope, $http ) {
    console.log( 'AccountController() !!!!!' );

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
  } )

  .controller( 'ProjectController', function( $scope, $http ) {
    console.log( 'ProjectController() hello hello' );

      $scope.projects = [
          { url: 'http://www.natue.com.br', title: 'natue' },
          { url: 'http://www.epicerie.com.br', title: 'epicerie' },
          { url: 'http://www.epicerie.com.br', title: 'dafiti' }
          ];


      $scope.create = function() {
         $http.post( '/project', $scope.newProject )
          .success( function( data ){
            console.log( 'auto save! yay! ', data );

          } )
          .error( function( data ){
            console.warn( 'oh nooooooo :( auto save error! ', data );
          } );
      };

  } );

} )( angular, perce );
