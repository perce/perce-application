( function( ng, perce ) {
  var perce = perce || {};

  perce.dashboardApp = angular.module( 'beastApp', [
    'ngRoute',
    'ngAnimate'
  ]);


  perce.dashboardApp.factory('httpRequestInterceptor', function () {
    return {
      request: function ( config ) {
        config.headers[ 'perce-ajax' ] = 'true';
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
        .when( '/projects/:id/:action', {
          templateUrl : 'views/beast/partials/project.html',
          controller  : 'ProjectController'
        } )
        .when( '/projects', {
          templateUrl : 'views/beast/partials/projects.html',
          controller  : 'ProjectsController'
        } )
        .otherwise( {
          redirectTo: '/'
        } );

        $locationProvider.html5Mode( true );

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

  .controller( 'ProjectsController', function( $scope, $http ) {
    console.log( 'ProjectsController() hello hello', $scope );

      $http( { method:'GET', url: 'projects' } ).
          success( function( data, status ) {
            $scope.projects = data;
            $scope.status = status;
            console.log( 'data loaded' );
          } ).
          error( function( data, status ) {
            $scope.data = data || "Request failed";
            $scope.status = status;
          } );

      $scope.addUser = function( id, email ){
        console.log( 'addUser()', id, email );

        $http( { method:'POST', url: '/projects/' + id + '/users', data: { 'email': email } } ).
          success( function( data, status ) {
            console.log( 'user added' );
          } ).
          error( function( data, status ) {
            console.warn( 'no user added ;(' );
        } );
      };

      $scope.create = function() {
         $http.post( '/projects', $scope.newProject )
          .success( function( data ){
            console.log( 'project created! yay! ' );

            $scope.projects.push( data.doc );

            $scope.newProject.name = '';
            $scope.newProject.url = '';

          } )
          .error( function( data ){
            console.warn( 'oh nooooooo :( auto save error! ', data );
          } );
      };

  } )

  .controller( 'ProjectController', function( $scope, $http, $routeParams, $location ) {
    console.log( 'ProjectController() hello yay!!', $routeParams.id );

    $scope.id = $routeParams.id;
    $scope.action = $routeParams.action;

    $scope.isActiveLink = function( path ) {
    var pathElements = $location.path().split( '/' );
    if ( pathElements[ pathElements.length - 1 ] === path ) {
      return 'active';
    } else {
      return '';
    }
  }

  } );

} )( angular, window.perce );
