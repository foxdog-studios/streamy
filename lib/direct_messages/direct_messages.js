'use strict';

const instance = Internal.instance;


// -------------------------------------------------------------------------- //
// --------------------- Overriden by client/server ------------------------- //
// -------------------------------------------------------------------------- //

Streamy._sessionsEmit = instance._sessionsEmit.bind(instance);

Streamy._sessionsForUsersEmit = instance._sessionsForUsersEmit.bind(instance);


// -------------------------------------------------------------------------- //
// -------------------------- Common interface ------------------------------ //
// -------------------------------------------------------------------------- //

Streamy.session = instance.sessions.bind(instance);

Streamy.sessionsForUsers = instance.sessionsForUsers.bind(instance);
