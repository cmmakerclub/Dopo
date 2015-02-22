'use strict';

var _ = require('lodash');
var Beacon = require('./beacon.model');

var BASE_TARGET_A = "A";
var BASE_TARGET_B = "B";
var BASE_TARGET_C = "C";

var findD = function (x, y, z) {
  
  var alpha = Math.acos( (z*z - x*x - y*y) / (-2 * x * y) );
  var beta = Math.acos( (x*x - z*z - y*y) / (-2 * z * y) );
  var D = y * ( (Math.sin(alpha) * Math.sin(beta)) / (Math.sin(alpha + beta)) );

  return D;
}


function getNearUUID(near) {
  return near.uuid;
}

function getAUUID(beacon) {
  return beacon.uuid == BASE_TARGET_A;
}

function getBUUID(beacon) {
  return beacon.uuid == BASE_TARGET_B;
}

function getCUUID(beacon) {
  return beacon.uuid == BASE_TARGET_C;
}

// Get list of beacons
exports.index = function(req, res) {
  Beacon.find(function (err, beacons) {
    if(err) { return handleError(res, err); }

    var baseUUID = ['A', 'B', 'C'];
    var nearTargetUUID = [];
    
    for (var i = 0; i < beacons.length; i++) {
      
      beacons[i].targets = [];
      nearTargetUUID.push(_.map(beacons[i].near, getNearUUID));

    };
    
    nearTargetUUID = _.intersection(nearTargetUUID[0], nearTargetUUID[1], nearTargetUUID[2]);

    var beaconA = _.find(beacons, getAUUID);
    var beaconB = _.find(beacons, getBUUID);
    var beaconC = _.find(beacons, getCUUID);

    for (var i = 0; i < nearTargetUUID.length; i++) {

      var targetUUID = nearTargetUUID[i];

      var t, b, a, x, y, z, o, p, targetX, targetY;

      x = _.find(beaconA.near, {uuid: targetUUID})
      y = _.find(beaconA.near, {uuid: BASE_TARGET_B})
      z = _.find(beaconB.near, {uuid: targetUUID})

      o = _.find(beaconC.near, {uuid: targetUUID})
      p = _.find(beaconC.near, {uuid: BASE_TARGET_B})

      x = x.distance;
      y = y.distance;
      z = z.distance;
      o = o.distance;
      p = p.distance;

      targetX = findD(x, y, z);
      targetY = findD(o, p, z);

      if (isNaN(targetX)) {
        targetX = 0;
      }

      if (isNaN(targetY)) {
        targetY = 0;
      }

      var position = [targetX, targetY];

      for (var i = 0; i < beacons.length; i++) {

        beacons[i].targets = [];
        beacons[i].targets.push({ uuid: targetUUID, coordinates: position });

      };

    };
        
    return res.json(200, beacons);
  });
};

// Get a single beacon
exports.show = function(req, res) {
  Beacon.findById(req.params.id, function (err, beacon) {
    if(err) { return handleError(res, err); }
    if(!beacon) { return res.send(404); }
    return res.json(beacon);
  });
};

// Creates a new beacon in the DB.
exports.create = function(req, res) {
  Beacon.create(req.body, function(err, beacon) {
    if(err) { return handleError(res, err); }
    return res.json(201, beacon);
  });
};

// Updates an existing beacon in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Beacon.findById(req.params.id, function (err, beacon) {
    if (err) { return handleError(res, err); }
    if(!beacon) { return res.send(404); }
    var updated = _.merge(beacon, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, beacon);
    });
  });
};

// Deletes a beacon from the DB.
exports.destroy = function(req, res) {
  Beacon.findById(req.params.id, function (err, beacon) {
    if(err) { return handleError(res, err); }
    if(!beacon) { return res.send(404); }
    beacon.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}