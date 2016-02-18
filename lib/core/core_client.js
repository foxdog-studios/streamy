'use strict';

const instance = Internal.instance;


// -------------------------------------------------------------------------- //
// ------------------------------- Overrides -------------------------------- //
// -------------------------------------------------------------------------- //

Streamy.init = instance.init.bind(instance);

Streamy._write = instance._write.bind(instance);
