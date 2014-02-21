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

    } ] );

  indexApp.controller( 'LoginController', function( $scope, $http ) {
    console.log( 'LoginController() ' );

    $scope.submit = function() {
      console.log( 'LoginController() ', $scope );

      $http.post('phones/phones.json').success(function(data) {
        $scope.phones = data;
      });
    };
  } );



  indexApp.controller( 'CreateUserController', function( $scope, $http ) {
    console.log( 'CreateUserController() ' );

    $scope.submit = function( event ) {
      console.log( 'CreateUserController() ', $scope );

      $http.post( '/user', $scope.data )
          .success( function( data ){
            console.log( 'login success! ', data );

            if ( data.url ){
              document.location = data.url;
            }
          } )
          .error( function( data ){
            console.warn( 'oh nooooooo :( login error! ', data );
          } );
    };
  } );
} )( angular );
