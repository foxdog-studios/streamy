'use strict';

const instance = Streamy._instance;

// -------------------------------------------------------------------------- //
// --------------------- Overriden by client/server ------------------------- //
// -------------------------------------------------------------------------- //

Streamy.broadcast = instance.broadcast.bind(instance);
