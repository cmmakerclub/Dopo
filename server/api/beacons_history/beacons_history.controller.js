'use strict';

var _ = require('lodash');
var BeaconsHistory = require('./beacons_history.model');
var Beacon = require('../beacon/beacon.model');

// Get list of beacons_historys
exports.index = function(req, res) {
  BeaconsHistory.find(function (err, beacons_historys) {
    if(err) { return handleError(res, err); }
    return res.json(200, beacons_historys);
  });
};

// Get a single beacons_history
exports.show = function(req, res) {
  BeaconsHistory.findById(req.params.id, function (err, beacons_history) {
    if(err) { return handleError(res, err); }
    if(!beacons_history) { return res.send(404); }
    return res.json(beacons_history);
  });
};

// Creates a new beacons_history in the DB.
exports.create = function(req, res) {
  BeaconsHistory.create(req.body, function(err, beacons_history) {
    if(err) { return handleError(res, err); }

    Beacon.update({uuid: req.body.uuid}, req.body, function (err, beacon, raw) {

      if (err) {
        return handleError(beacon, err);
      }

      return res.json(201, beacons_history);  
    })

  });
};

// Updates an existing beacons_history in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  BeaconsHistory.findById(req.params.id, function (err, beacons_history) {
    if (err) { return handleError(res, err); }
    if(!beacons_history) { return res.send(404); }
    var updated = _.merge(beacons_history, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, beacons_history);
    });
  });
};

// Deletes a beacons_history from the DB.
exports.destroy = function(req, res) {
  BeaconsHistory.findById(req.params.id, function (err, beacons_history) {
    if(err) { return handleError(res, err); }
    if(!beacons_history) { return res.send(404); }
    beacons_history.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}