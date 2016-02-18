'use strict';

const instance = Internal.instance;


// -------------------------------------------------------------------------- //
// --------------------- Overriden by client/server ------------------------- //
// -------------------------------------------------------------------------- //

Streamy.id = instance.id.bind(instance);

Streamy.userId = instance.userId.bind(instance);

Streamy.user = instance.user.bind(instance);
