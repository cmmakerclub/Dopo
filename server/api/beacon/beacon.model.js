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

var BeaconSchema = new Schema({
  uuid: String,
  near: [BeaconDistanceSchema],
  position: [Number],
  targets: [PositionSchema],
  last_update: Date,
  color: {type: String, default: "red"}
});

module.exports = mongoose.model('Position', PositionSchema);
module.exports = mongoose.model('BeaconDistance', BeaconDistanceSchema);
module.exports = mongoose.model('Beacon', BeaconSchema);