var perce = perce || {};

( function( perce ) {

  perce.beastApp.controller( 'accountController', function( $scope, $http ) {
    console.log( 'accountController() hellolhello' );

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

} )( perce );