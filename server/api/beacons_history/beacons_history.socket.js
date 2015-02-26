/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var BeaconsHistory = require('./beacons_history.model');

exports.register = function(socket) {
  BeaconsHistory.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  BeaconsHistory.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('beacons_history:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('beacons_history:remove', doc);
}