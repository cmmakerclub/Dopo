'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PositionSchema = new Schema({
  coordinates: [Number], 
  uuid: String
});

var BeaconDistanceSchema = new Schema({
  uuid: String,
  rssi: String,
  distance: Number,
});

var BeaconsHistorySchema = new Schema({
  uuid: String,
  near: [BeaconDistanceSchema],
  position: [Number],
  targets: [PositionSchema],
  last_update: {type: Date, default: new Date()},
  color: {type: String, default: "red"}
});

module.exports = mongoose.model('BeaconsHistory', BeaconsHistorySchema);