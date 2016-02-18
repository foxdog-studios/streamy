'use strict';

const instance = Streamy._instance;


// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy._sessionsEmit = instance._sessionsEmit.bind(instance);

Streamy._sessionsForUsersEmit = instance._sessionsForUsersEmit.bind(instance);
