( function( perce ) {

  perce.dashboardApp.controller( 'ProjectController', function( $scope, $http ) {
    console.log( 'ProjectController() ' );

      $scope.projects = [
          { url: 'http://www.natue.com.br', title: 'natue' },
          { url: 'http://www.epicerie.com.br', title: 'epicerie' }
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

} )( perce );