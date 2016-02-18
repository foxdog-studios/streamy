'use strict';

const instance = Internal.instance;

// -------------------------------------------------------------------------- //
// --------------------- Overriden by client/server ------------------------- //
// -------------------------------------------------------------------------- //

Streamy.broadcast = instance.broadcast.bind(instance);
