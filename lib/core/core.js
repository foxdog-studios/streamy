'use strict';

const instance = Internal.instance;


// -------------------------------------------------------------------------- //

var handlers = instance._handlers;
var connect_handlers = instance._connectHandlers;
var disconnect_handlers = instance._disconnectHandlers;


// -------------------------------------------------------------------------- //
// --------------------- Overriden by client/server ------------------------- //
// -------------------------------------------------------------------------- //

Streamy.init = instance.init.bind(instance);

Streamy._write = instance._write.bind(instance);


// -------------------------------------------------------------------------- //
// ------------------------------ Accessors --------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.connectHandlers = instance.connectHandlers.bind(instance);

Streamy.disconnectHandlers = instance.disconnectHandlers.bind(instance);

Streamy.handlers = instance.handlers.bind(instance);


// -------------------------------------------------------------------------- //
// -------------------------- Common interface ------------------------------ //
// -------------------------------------------------------------------------- //

Streamy._applyPrefix = instance._applyPrefix.bind(instance);

Streamy.on = instance.on.bind(instance);

Streamy.onConnect = instance.onConnect.bind(instance);

Streamy.onDisconnect = instance.onDisconnect.bind(instance);

Streamy.emit = instance.emit.bind(instance);
