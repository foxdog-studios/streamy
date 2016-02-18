'use strict';

const instance = Internal.instance;


// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.id = instance.id.bind(instance);

Streamy.userId = instance.userId.bind(instance);

Streamy.user = instance.user.bind(instance);
