( function( perce ) {

  perce.dashboardApp.controller( 'AccountController', function( $scope, $http ) {
    console.log( 'AccountController() ' );

      $scope.save = function() {
         $http.put( '/account', $scope.account )
          .success( function( data ){
            console.log( 'auto save! yay! ', data );
            if ( data.url ){
              document.location = data.url;
            }
          } )
          .error( function( data ){
            console.warn( 'oh nooooooo :( auto save error! ', data );
            if( data.error ) {
              $scope.errorMessage = data.error;
            }
          } );

    };
  } );

} )( perce );