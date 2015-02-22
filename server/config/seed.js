/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Beacon = require('../api/beacon/beacon.model');
var User = require('../api/user/user.model');

Beacon.find({}).remove(function() {
  Beacon.create({
    uuid: "A",
    near: [
      {
        uuid: "B",
        rssi: -30,
        distance: 100,
      },
      {
        uuid: "C",
        rssi: -30,
        distance: 140,
      },
      {
        uuid: "target",
        rssi: -30,
        distance: 31,
      }     
    ],
    position: [100, 0],
    color: "#FFFFFF",
    last_update: new Date()
  }, {
    uuid: "B",
    near: [
      {
        uuid: "A",
        rssi: -30,
        distance: 100,
      },
      {
        uuid: "C",
        rssi: -30,
        distance: 100,
      },
      {
        uuid: "target",
        rssi: -30,
        distance: 73,
      },      
    ],
    position: [0, 0],
    color: "#FFFFFF",    
    last_update: new Date()
  }, {
    uuid: "C",
    near: [
      {
        uuid: "B",
        rssi: -30,
        distance: 100,
      },
      {
        uuid: "A",
        rssi: -30,
        distance: 140,
      },
      {
        uuid: "target",
        rssi: -30,
        distance: 110,
      },      
      {
        uuid: "targetUNKONW",
        rssi: -30,
        distance: 999,
      },            
    ],
    position: [0, 100],
    color: "#FFFFFF", 
    last_update: new Date()
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});