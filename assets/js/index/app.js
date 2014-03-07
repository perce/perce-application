var perce = perce || {};

( function( ng, perce ) {

  perce.indexApp = ng.module( 'indexApp', [
    'ngRoute'
  ])

  .factory('httpRequestInterceptor', function () {
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
        .when( '/', {
          templateUrl : 'views/beauty/partials/home.html',
        } )
        .when( '/howitworks', {
          templateUrl : 'views/beauty/partials/howitworks.html',
        } )
        .when( '/features', {
          templateUrl : 'views/beauty/partials/features.html',
        } )
        .when( '/whoweare', {
          templateUrl : 'views/beauty/partials/whoweare.html',
        } )
        .when( '/contact', {
          templateUrl : 'views/beauty/partials/contact.html',
        } )
        .when( '/user', {
          templateUrl : 'views/beauty/partials/user.html',
          controller  : 'CreateUserController'
        } )
        .when( '/login', {
          templateUrl : 'views/beauty/partials/login.html',
          controller  : 'LoginController'
        } )
        .otherwise( {
          redirectTo: '/'
        } );

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('httpRequestInterceptor');

    } ] );

} )( angular, perce );
