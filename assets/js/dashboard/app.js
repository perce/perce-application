( function( ng, perce ) {
  var perce = perce || {};

  perce.dashboardApp = angular.module( 'beastApp', [
    'ui.router',
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

  .config( [ '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
    function AppConfig( $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider ) {

    $urlRouterProvider.otherwise("/");
      //
      // Now set up the states
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'views/beast/partials/home.html'
        })
        .state('account', {
          url: '/account',
          templateUrl: 'views/beast/partials/account.html',
          controller: 'AccountController'
        })
        .state('projects', {
          url: '/projects',
          templateUrl: 'views/beast/partials/projects.html',
          controller: 'ProjectsController'
        })
        .state('project', {
          url: '/project/:id',
          templateUrl: 'views/beast/partials/project.html',
          controller: 'ProjectController'
        })
        .state('project.general', {
          url: '/general',
          views: {
            'main': {
              templateUrl: 'views/beast/partials/project_general.html',
              controller: 'ProjectController'
            }
          }
        })
        .state('project.requests', {
          url: '/requests',
          views: {
            'main': {
              templateUrl: 'views/beast/partials/project_requests.html',
              controller: 'ProjectController'
            }
          }
        });


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

  .controller( 'ProjectController', function( $scope, $http, $stateParams, $location ) {
    console.log( 'ProjectController() hello yay!!', $stateParams );

    $scope.id = $stateParams.id;


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
