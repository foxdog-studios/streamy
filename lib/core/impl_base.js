Streamy.StreamyBaseImpl = class StreamyBaseImpl {

  constructor() {
    this._connectHandlers = [];
    this._disconnectHandlers = [];
    this._handlers = {};
  }


  // -- Overriden by client/server -------------------------------------------

  /**
   * Init streamy, attach base handlers in client/server
   */
  init() {}

  /**
   * Write the message on the socket
   * @param {String} data Data stringified
   * @param {Object} to (Server side) Which socket should we use
   */
  _write (data, to) { }


  // -- Accessors ------------------------------------------------------------

  /**
   * Retrieve connect handlers
   */
  connectHandlers () {
    return this._connectHandlers;
  }

  /**
   * Retrieve disconnect handlers
   */
  disconnectHandlers () {
    return this._disconnectHandlers;
  }

  /**
   * Retrieve all handlers or the one for the given message
   * @param {String} message Optional, if defined, returns the handler for this
   * specific messsage
   */
  handlers (message) {
    if (message) {
      var handler = this._handlers[message];
      if (!handler) {
        handler = function() {};
      }
      return handler;
    }
    return this._handlers;
  }


  // -- Common interface -----------------------------------------------------

  /**
   * Apply a specific prefix to avoid name conflicts
   * @param {String} value Base value
   * @return {String} The base value prefixed
   */
  _applyPrefix (value) {
    return 'streamy$' + value;
  }

  /**
   * Register an handler for the given message type
   * @param {String} message Message name to handle
   * @param {Function} callback Callback to call when this message is received
   */
  on (message, callback) {
    message = this._applyPrefix(message);
    this._handlers[message] = Meteor.bindEnvironment(callback);
  }

  /**
   * Adds an handler for the connection success
   * @param {Function} callback Callback to call upon connection
   */
  onConnect (callback) {
    this._connectHandlers.push(Meteor.bindEnvironment(callback));
  }

  /**
   * Adds an handler for the disconnection
   * @param {Function} callback Callback to call upon disconnect
   */
  onDisconnect (callback) {
    this._disconnectHandlers.push(Meteor.bindEnvironment(callback));
  }

  /**
   * Emits a message with the given name and associated data
   * @param {String} message Message name to emit
   * @param {Object} data Data to send
   * @param {Socket} to (Server side only) which socket we should use
   */
  emit (message, data, to) {
    data = data || {};
    message = this._applyPrefix(message);

    check(message, String);
    check(data, Object);

    data.msg = message;

    // TODO: Convert to this.
    Streamy._write(JSON.stringify(data), to);
  }


  // -- Broadcast ------------------------------------------------------------

  /**
   * Returns an object for the targetted session id which contains an emit
   * method
   * @param {String} message Message to emit
   * @param {Object} data Data to send
   * @param {Array|String} except Which sid should we exclude from the
   * broadcast message
   */
  broadcast (message, data, except) {}


  // -- Direct message -------------------------------------------------------

  /**
   * Gets the wrapper for the emit returned by Streamy.sessions(sid)
   * @param {String|Array} sid Session id(s)
   * @return  {Function}  Function which will be called by emit on the session
   */
  _sessionsEmit (sid) {}

  /**
   * Gets the wrapper for the emit returned by Streamy.sessionsForUsers(sid)
   * @param {String|Array} uid User id(s)
   * @return  {Function}  Function which will be called by emit on the session
   */
  _sessionsForUsersEmit (uid) {}

  /**
   * Returns an object for the targetted session id(s) which contains an emit
   * method
   * @param {String|Array} sid Session id(s)
   * @return  {Object}  Object with an emit function
   */
  sessions (sid) {
    return {
      emit: Streamy._sessionsEmit(sid)
    };
  }

  /**
   * Returns an object for the targetted user id(s) which contains an emit
   * method
   * @param {String|Array} uid User id(s)
   * @return  {Object}  Object with an emit function
   */
  sessionsForUsers (uid) {
    return {
      emit: Streamy._sessionsForUsersEmit(uid)
    }
  }


  // -- Utils ----------------------------------------------------------------

  /**
   * Retrieve the connection id
   * @param  {Socket} socket On server, should be given to determine the
   * concerned connection
   * @return {String}        The connection id
   */
  id (socket) {}

  /**
   * Retrieve the user id
   * @param {Socket} socket On server, should be given to determine the
   * concerned user
   */
  userId (socket) {}

  /**
   * Retrieve the user
   * @param {Socket} socket On server, should be given to determine the
   * concerned user
   */
  user (socket) {}

};
