'use strict';

const instance = Streamy._instance;


// -------------------------------------------------------------------------- //
// --------------------- Overriden by client/server ------------------------- //
// -------------------------------------------------------------------------- //

Streamy.id = instance.id.bind(instance);

Streamy.userId = instance.userId.bind(instance);

Streamy.user = instance.user.bind(instance);
