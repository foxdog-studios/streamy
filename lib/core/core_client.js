'use strict';

const instance = Streamy._instance;


// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.init = instance.init.bind(instance);

Streamy._write = instance._write.bind(instance);
