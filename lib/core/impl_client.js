'use strict'

Streamy.StreamyImpl = class StreamyImpl extends Streamy.StreamyBaseImpl {

  init() {
    var self = this;

    // Uppon close
    Meteor.default_connection._stream.on('disconnect', function onClose() {
      // If it was previously connected, call disconnect handlers
      if(Meteor.default_connection._stream.status().connected) {
        _.each(self.disconnectHandlers(), function forEachDisconnectHandler(cb) {
          cb.call(self);
        });
      }
    });

    // Attach message handlers
    Meteor.default_connection._stream.on('message', function onMessage(data) {

      // Parse the message
      var parsed_data = JSON.parse(data);

      // Retrieve the msg value
      var msg = parsed_data.msg;

      // And dismiss it
      delete parsed_data.msg;

      // If its the connected message
      if(msg === 'connected') {
        // Call each handlers
        _.each(self.connectHandlers(), function forEachConnectHandler(cb) {
          cb.call(self);
        });
      }
      else if(msg) {
        // Else, call the appropriate handler
        self.handlers(msg).call(self, parsed_data);
      }
    });
  }

  _write (data) {
    Meteor.default_connection._stream.send(data);
  };


  // -- Utils ----------------------------------------------------------------

  id () {
    return Meteor.connection._lastSessionId;
  }

  userId (socket) {
    if(!Meteor.userId)
      throw new Meteor.Error(500, 'Could not retrieve user id, is accounts-base installed?');

    return Meteor.userId();
  }

  user (socket) {
    if(!Meteor.user)
      throw new Meteor.Error(500, 'Could not retrieve user, is accounts-base installed?');

    return Meteor.user();
  }


  // -- Broadcast ------------------------------------------------------------

  broadcast (message, data, except) {
    Streamy.emit('__broadcast__', {
      '__msg': message,
      '__data': data,
      '__except': except
    });
  }


  // -- Direct message -------------------------------------------------------

  _sessionsEmit (sid) {
    return function(msg, data) {
      Streamy.emit('__direct__', {
        '__to': sid,
        '__msg': msg,
        '__data': data
      });
    };
  }

  _sessionsForUsersEmit (uid) {
    return function(msg, data) {
      Streamy.emit('__direct__', {
        '__to_users': uid,
        '__msg': msg,
        '__data': data
      });
    };
  }

};
