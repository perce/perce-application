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

} )( angular, perce );
