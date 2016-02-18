'use strict';

const instance = Internal.instance;


// -------------------------------------------------------------------------- //
// ------------------------------ Allow/deny -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.DirectMessages.allow = instance.allowDirectMessage.bind(instance);


// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy._sessionsEmit = instance._sessionsEmit.bind(instance);

Streamy._sessionsForUsersEmit = instance._sessionsForUsersEmit.bind(instance);
