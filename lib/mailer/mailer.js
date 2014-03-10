var debug           = require( 'debug' )( 'MAILER/MAILER' );
var config          = require( '../../config/config' );
var mandrill        = require( 'mandrill-api/mandrill' );
var mandrill_client = new mandrill.Mandrill( config.mandrill.apiKey );
var emitter         = require( '../../lib/emitter/emitter' );

var Mailer = function() {
  emitter.on( 'user__signUp',     this.userSignUp );
  emitter.on( 'user__invitation', this.userInvitation );
  emitter.on( 'project__create',  this.projectCreate );
  emitter.on( 'project__addUser', this.projectAddUser );
}


Mailer.prototype.userInvitation = function( email, hash, projectName ) {
  var message = {
    'subject'    : 'You where invited to Perce.io',
    'from_email' : 'hello@perce.io',
    'from_name'  : 'Perce.io',
    'to': [{
      'email' : email,
      'name'  : email,
      'type'  : 'to'
    }],
    'headers'    : {
      'Reply-To' : 'hello@perce.io'
    },
    'merge'      : true,
    'tags'       : [
      'user__signUp'
    ],
    'metadata'   : {
      'website': 'www.perce.io'
    },
  }

  mandrill_client.messages.sendTemplate(
    {
      'template_name'    : 'user__invitation',
      'template_content' : [ {
        'name'    : 'email',
        'content' : email
      },
      {
        'name'    : 'hash',
        'content' : hash
      },
      {
        'name'    : 'projectName',
        'content' : projectName
      } ],
      'message': message,
      'async': false,
      'ip_pool': 'Main Pool'
    },
    function(result) {
      console.log(result);
    },
    function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    }
  );
}

/**
 * Send user sign up mail
 *
 * @param  {String} email email
 */
Mailer.prototype.userSignUp = function( email ) {
  var message = {
    'subject'    : 'Sign up Perce.io',
    'from_email' : 'hello@perce.io',
    'from_name'  : 'Perce.io',
    'to': [{
      'email' : email,
      'name'  : email,
      'type'  : 'to'
    }],
    'headers'    : {
      'Reply-To' : 'hello@perce.io'
    },
    'merge'      : true,
    'tags'       : [
      'user__signUp'
    ],
    'metadata'   : {
      'website': 'www.perce.io'
    },
  }

  mandrill_client.messages.sendTemplate(
    {
      'template_name'    : 'user__signUp',
      'template_content' : [ {
        'name'    : 'email',
        'content' : email
      } ],
      'message': message,
      'async': false,
      'ip_pool': 'Main Pool'
    },
    function(result) {
      console.log(result);
    },
    function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    }
  );
};


/**
 * Send user creation email
 *
 * @param  {String} email email
 * @param  {String} name  project name
 */
Mailer.prototype.projectCreate = function( email, name ) {
  debug( email, name );
  var message = {
    'subject'    : 'New project at Perce.io',
    'from_email' : 'hello@perce.io',
    'from_name'  : 'Perce.io',
    'to': [{
      'email' : email,
      'name'  : email,
      'type'  : 'to'
    }],
    'headers'    : {
      'Reply-To' : 'hello@perce.io'
    },
    'merge'      : true,
    'tags'       : [
      'user__signUp'
    ],
    'metadata'   : {
      'website': 'www.perce.io'
    },
  }

  mandrill_client.messages.sendTemplate(
    {
      'template_name'    : 'project__create',
      'template_content' : [ {
        'name'    : 'name',
        'content' : name
      } ],
      'message': message,
      'async': false,
      'ip_pool': 'Main Pool'
    },
    function(result) {
      console.log(result);
    },
    function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    }
  );
};


Mailer.prototype.projectAddUser = function( email, projectName ) {
  debug( email, projectName );
  var message = {
    'subject'    : 'You were invited to \'' + projectName + '\' Perce.io',
    'from_email' : 'hello@perce.io',
    'from_name'  : 'Perce.io',
    'to': [{
      'email' : email,
      'name'  : email,
      'type'  : 'to'
    }],
    'headers'    : {
      'Reply-To' : 'hello@perce.io'
    },
    'merge'      : true,
    'tags'       : [
      'user__signUp'
    ],
    'metadata'   : {
      'website': 'www.perce.io'
    },
  }

  mandrill_client.messages.sendTemplate(
    {
      'template_name'    : 'project__addUser',
      'template_content' : [ {
        'name'    : 'projectName',
        'content' : projectName
      } ],
      'message': message,
      'async': false,
      'ip_pool': 'Main Pool'
    },
    function(result) {
      console.log(result);
    },
    function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    }
  );
};




module.exports = new Mailer();
