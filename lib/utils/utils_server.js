'use strict';

const instance = Streamy._instance;

// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.id =  instance.id.bind(instance);

Streamy.userId = instance.userId.bind(instance);

Streamy.user = instance.user.bind(instance);
