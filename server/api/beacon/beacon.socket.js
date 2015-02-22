/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Beacon = require('./beacon.model');

exports.register = function(socket) {
  Beacon.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Beacon.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('beacon:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('beacon:remove', doc);
}