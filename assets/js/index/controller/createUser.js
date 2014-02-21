( function( perce ) {

  perce.indexApp.controller( 'CreateUserController', function( $scope, $http ) {
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

} )( perce );