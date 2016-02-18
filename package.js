'use strict';

Package.describe({
  name: 'yuukan:streamy',
  version: '1.3.0',
  // Brief, one-line summary of the package.
  summary: 'Simple interface to use the underlying sockjs in a meteor application',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/YuukanOO/streamy',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.use([
    'check',
    'ecmascript',
    'ecmascript-runtime',
    'mongo',
    'reactive-var',
    'underscore',
  ]);

  // Both
  api.addFiles([
    'lib/namespaces.js',
    'lib/core/core.js',
    'lib/direct_messages/direct_messages.js',
    'lib/broadcasts/broadcasts.js',
    'lib/utils/utils.js'
  ]);

  // Client only
  api.addFiles([
    'lib/core/core_client.js',
    'lib/direct_messages/direct_messages_client.js',
    'lib/broadcasts/broadcasts_client.js',
    'lib/utils/utils_client.js'
  ], 'client');

  // Server only
  api.addFiles([
    'lib/core/core_server.js',
    'lib/direct_messages/direct_messages_server.js',
    'lib/broadcasts/broadcasts_server.js',
    'lib/utils/utils_server.js'
  ], 'server');

  api.export([
    'Streamy'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('yuukan:streamy');
});
