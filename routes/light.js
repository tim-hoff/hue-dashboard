var express = require('express');
var router = express.Router();
var hue = require("node-hue-api");
var HueApi = hue.HueApi;
var lightState = hue.lightState;
var hostname = "192.168.1.3"; // lab
// var hostname = "192.168.1.109"; // home
var username = "TimH1993zxcv";
var userDescription = "The real M.V.P.";

var api = new HueApi(hostname, username);
var light_1 = 1, light_2 = 2, light_3 = 3;
var lamp = 4, ls1 = 1, ls2 = 2;
var tech_lab = [ls1, ls2, lamp]
var state = lightState.create().on().rgb([0,200,0]).alertLong();

function blinkLights(value) {
  var state_low = lightState.create().bri(1).rgb([100,0,255]);
  var state_med = lightState.create().bri(100).rgb([100,0,255]);
  var state_high = lightState.create().bri(254).rgb([100,0,255]);
  var state_alert = lightState.create().bri(180).rgb([255,0,0]).alert("select");

  api.setLightState(value, state_alert).done();
};

/* GET users listing. */

router.use('/', function(req, res, next) {
  arr = req.body.light
  // wrap the action in this. 
  Object.prototype.toString.call(arr) == "[object Array]" ? arr.forEach(blinkLights): blinkLights(arr);
  console.log(arr);
  next();
});

router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = router;
