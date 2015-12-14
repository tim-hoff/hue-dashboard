var express = require('express');
var router = express.Router();
var hue = require("node-hue-api");
var HueApi = hue.HueApi;
var lightState = hue.lightState;
// var hostname = "192.168.1.3"; // lab
var hostname = "192.168.1.109"; // home

var username = "TimH1993zxcv";
var userDescription = "The real M.V.P.";
// http://www.developers.meethue.com/documentation/supported-lights
// http://www.developers.meethue.com/documentation/color-conversions-rgb-xy
// lightstrips and bulb/spot are different gamuts.. uggh...

// For the hue bulb (Gamut B) the corners of the triangle are:
//   Red: 0.675, 0.322
//   Green: 0.409, 0.518
//   Blue: 0.167, 0.04

var api = new HueApi(hostname, username);


function ct(value) {
  console.log("converting ct");
};
function xy(value) {
  console.log("converting xy");
};
function hs(value) {
  console.log("converting hs");
};


var displayStatus = function(status) {
    var colormode = status.state.colormode;
    var rgb = [0,0,0]
    json_string = JSON.stringify(status, null, 2);
    console.log(json_string);
    
    switch (colormode) {
      case "ct" : 
        ct();
        break;
      case "xy":
        xy();
        break;   
      case "hs":
        hs();
        break;
      default:
        console.log("something is wrong with the colormode.");
    }

    return rgb;
};


router.use('/', function(req, res, next) {
  light = req.body.light;
  api.lightStatus(light).then(displayStatus).done();
  console.log(req.body);
  next();
});

router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = router;
