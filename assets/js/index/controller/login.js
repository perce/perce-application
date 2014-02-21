( function( perce ) {

  perce.indexApp.controller( 'LoginController', function( $scope, $http ) {
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

} )( perce );