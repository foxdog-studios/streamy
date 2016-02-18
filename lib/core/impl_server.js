'use strict';

Streamy.StreamyImpl = class StreamyImpl extends Streamy.StreamyBaseImpl {

  constructor() {
    super();
    this._sessions = {};

    /**
     * Contains reactive variables for each connection id/user id
     * @type {Object}
     */
    this._usersId = {};

    /**
     * Attach the broadcast message handler
     * @param {Object} data Data object
     * @param {Socket} from Socket emitter
     */
    this.on('__broadcast__', (data, from) => {

      // Check for sanity
      if (!data.__msg || !data.__data)
        return;

      // Check if the server allows this direct message
      if (!this.allowBroadCast(data, from))
        return;

      // Attach the sender ID to the inner data
      data.__data.__from = this.id(from);

      // And then emit the message
      this.broadcast(data.__msg, data.__data, data.__except);
    });

    /**
     * Attach the direct message handler
     * @param {Object} data Data object
     * @param {Socket} from Socket emitter
     */
    this.on('__direct__', (data, from) => {

      // Check for sanity
      if(!data.__msg || !data.__data)
        return;

      var to_socks = null;

      if(data.__to_users)
        to_socks = this.socketsForUsers(data.__to_users);
      else if(data.__to)
        to_socks = this.sockets(data.__to);

      if(!to_socks)
        return;

      // Check if the server allows this direct message
      if(!this.allowDirectMessage(data, from, to_socks))
          return;

      // Attach the sender ID to the inner data
      data.__data.__from = this.id(from);

      // And then emit the message
      this.emit(data.__msg, data.__data, to_socks);
    });
  }

  /**
   * Retrieve server connected sockets or a subset
   * @param {String|Array} sid Optional, socket id or ids to retrieve
   * @return {Object} If sid is provided, it will returns an object with a send
   * method and _sockets array of sockets, else, it will returns all sockets
   */
  sockets (sid) {
    if (sid) {
      sid = _.isArray(sid) ? sid : [sid];
      var sockets = [];

      _.each(sid, function(session_id) {
        var sock = this._sessions[session_id];

        if(sock)
          sockets.push(sock);
      });

      return {
        _sockets: sockets,
        send: function(data) {
          _.each(sockets, function(socket) {
            socket.send(data);
          });
        }
      }
    }

    return this._sessions;
  }

  /**
   * Retrieve server connected sockets or a subset
   * @param {String|Array} uid Optional, user id or ids to retrieve
   * @return  {Object} If uid is provided, it will returns an object with a
   * send method and _sockets array of sockets, else, it will returns all
   * sockets
   */
  socketsForUsers (uid) {
    if(uid) {
      uid = _.isArray(uid) ? uid : [uid];

      var sockets = _.filter(Streamy.sockets(), function(socket) {
        return uid.indexOf(socket._meteorSession.userId) !== -1;
      });

      return {
        _sockets: sockets,
        send: function(data) {
          _.each(sockets, function(socket) {
            socket.send(data);
          });
        }
      }
    }

    return this._sessions;
  }


  // -- Overrides ------------------------------------------------------------

  init () {
    var self = this;

    // If accounts package is installed, register for successful login attempts
    if(typeof(Accounts) !== 'undefined' ) {
      Accounts.onLogin(function onLoggedIn(data) {
        Streamy._usersId[data.connection.id].set(data.user._id);
      });
    }

    // When a new connection has been received
    Meteor.default_server.stream_server.register(function onNewConnected(socket) {
      var handlers_registered = false;

      // On closed, call disconnect handlers
      socket.on('close', function onSocketClosed() {
        if(handlers_registered) {
          var sid = Streamy.id(socket);

          delete self._sessions[sid];
          delete Streamy._usersId[sid];

          _.each(self.disconnectHandlers(), function forEachDisconnectHandler(cb) {
            cb.call(self, socket);
          });
        }
      });

      // This little trick is used to register protocol handlers on the
      // socket._meteorSession object, so we need it to be set
      socket.on('data', function onSocketData(raw_data) {

        // Since we doesn't have a Accounts.onLogout callback, we must use this little trick, will be replaced when a proper callback is added
        if(JSON.parse(raw_data).method === 'logout' && socket.__sid) {
          Streamy._usersId[Streamy.id(socket)].set(null);
        }

        // Only if the socket as a meteor session
        if(!handlers_registered && socket._meteorSession) {

          // Store the meteorSesion id in an inner property since _meteorSession will be deleted upon socket closed
          socket.__sid = socket._meteorSession.id;

          var sid = Streamy.id(socket);

          handlers_registered = true;

          self._sessions[sid] = socket;
          Streamy._usersId[sid] = new ReactiveVar(null);

          // Call connection handlers
          _.each(self.connectHandlers(), function forEachConnectHandler(cb) {
            cb.call(self, socket);
          });

          // Add each handler to the list of protocol handlers
          _.each(self.handlers(), function forEachHandler(cb, name) {
            if(!socket._meteorSession.protocol_handlers[name]) {
              socket._meteorSession.protocol_handlers[name] = function onMessage(raw_msg) {
                delete raw_msg.msg; // Remove msg field
                cb.call(self, raw_msg, this.socket);
              };
            }
          });
        }
      });
    });
  }

  _write (data, to) {
    if(to) {
      to.send(data);
    }
  }


  // -- Utils ----------------------------------------------------------------

  id (socket) {
    return socket.__sid;
  }

  userId (socket) {
    if(!socket)
      throw new Meteor.Error(500, 'You should provides a socket server-side');

    return Streamy._usersId[Streamy.id(socket)].get();
  }

  user (socket) {
    if(!Meteor.users)
      throw new Meteor.Error(500, 'Could not retrieve user, is accounts-base installed?');

    return Meteor.users.findOne(Streamy.userId(socket));
  }


  // -- Broadcast ------------------------------------------------------------

  /**
   * Wether or not the broadcast is allowed
   * @param {Object} data Data of the message
   * @param {Socket} from From socket
   */
  allowBroadCast (data, from) {
    return true;
  }

  broadcast (message, data, except) {
    if(!_.isArray(except))
      except = [except];

    _.each(Streamy.sockets(), function(sock) {
      if(except.indexOf(Streamy.id(sock)) !== -1)
        return;

      Streamy.emit(message, data, sock);
    });
  }


  // -- Direct message -------------------------------------------------------

  /**
   * Wether or not the direct messages is allowed
   * @param {Object} data Data of the message
   * @param {Socket} from From socket
   * @param {Object} to Special object as returned by Streamy.sockets
   */

  allowDirectMessage (data, from, to) {
    return true;
  }

  _sessionsEmit (sid) {
    var socket = _.isObject(sid) ? sid : Streamy.sockets(sid);

    return function(msg, data) {
      Streamy.emit(msg, data, socket);
    };
  }

  _sessionsForUsersEmit (uid) {
    uid = _.isArray(uid) ? uid : [uid];
    var sockets = Streamy.socketsForUsers(uid);

    return function(msg, data) {
      Streamy.emit(msg, data, sockets);
    };
  }

};
