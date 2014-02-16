'use strict';

var myAppControllers = angular.module('myAppControllers', []);


myAppControllers.controller('MyAppController', function ($scope) {
    console.log( '-> yay MyAppController executed' );
  }
);