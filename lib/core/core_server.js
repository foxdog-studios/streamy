const instance = Streamy._instance;


// -------------------------------------------------------------------------- //

var sessions = instance._sessions;


// -------------------------------------------------------------------------- //
// ------------------------------- Accessors -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy._usersId = instance._usersId;

Streamy.sockets = instance.sockets.bind(instance);

Streamy.socketsForUsers = instance.socketsForUsers.bind(instance);


// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.init = instance.init.bind(instance);

Streamy._write = instance._write.bind(instance);
