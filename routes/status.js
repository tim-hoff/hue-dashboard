var express = require('express');
var router = express.Router();
var hue = require("node-hue-api");
var HueApi = hue.HueApi;
var lightState = hue.lightState;
var hostname = "192.168.1.3"; // lab
// var hostname = "192.168.1.109"; // home

var username = "TimH1993zxcv";
var userDescription = "The real M.V.P.";
// http://www.developers.meethue.com/documentation/supported-lights
// http://www.developers.meethue.com/documentation/color-conversions-rgb-xy
// lightstrips and bulb/spot are different gamuts.. uggh...

// For the hue bulb (Gamut B) the corners of the triangle are:
//   Red: 0.675, 0.322
//   Green: 0.409, 0.518
//   Blue: 0.167, 0.04
var color_rgb;
var api = new HueApi(hostname, username);


function ct(value) {
  console.log("converting ct");
};

function xy(value, brightness) {
  var x = value[0];
  var y = value[1];
  var z = 1 - x - y;
  var Y = (brightness == 0) ? 0 : brightness/ 255;
  var X = (Y / y) * x;
  var Z = (Y / y) * z;

  // sRGB D65 conversion
  var r =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
  var g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
  var b =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;
  var R, G, B;
  if (r > b && r > g && r > 1.0) {
      // red is too big
      g = g / r;
      b = b / r;
      r = 1.0;
  }
  else if (g > b && g > r && g > 1.0) {
      // green is too big
      r = r / g;
      b = b / g;
      g = 1.0;
  }
  else if (b > r && b > g && b > 1.0) {
      // blue is too big
      r = r / b;
      g = g / b;
      b = 1.0;
  }

  r = (r <= 0.0031308) ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
  g = (g <= 0.0031308) ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
  b = (b <= 0.0031308) ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
  
  if (r > b && r > g) {
      // red is biggest
      if (r > 1.0) {
          g = g / r;
          b = b / r;
          r = 1.0;
      }
    }
  else if (g > b && g > r) {
    // green is biggest
    if (g > 1.0) {
        r = r / g;
        b = b / g;
        g = 1.0;
    }
  }
  else if (b > r && b > g) {
    // blue is biggest
    if (b > 1.0) {
        r = r / b;
        g = g / b;
        b = 1.0;
    }
  }
function clamp(number, min, max) {
  num = Math.round(number*255)
  return num < min ? min : num > max ? max : num;
}
  R = clamp(r, 0, 255);
  G = clamp(g, 0, 255);
  B = clamp(b, 0, 255);

  console.log("converting xyz");
  console.log("x =", x, "y =", y, "z =",z);
  console.log("X =", X, "Y =", Y, "Z =",Z);
  console.log("r =", r, "g =", g, "b =",b);
  console.log("R =", R, "G =", G, "B =",B);
  color_rgb =  "rgb(" + R + "," + G + "," + B + ")";
};
function hs(value) {
  console.log("converting hs");
};

var displayStatus = function(status) {
    var state = status.state
    var colormode = state.colormode;
   
    var rgb = [0,0,0]
    json_string = JSON.stringify(status, null, 2);
    console.log(json_string);
    
    switch (colormode) {
      case "ct" : 
        ct();
        break;
      case "xy":
        xy(state.xy, state.bri);
        break;   
      case "hs":
        hs();
        break;
      default:
        console.log("something is wrong with the colormode.");
    }
    console.log("=================================================");
};

router.use('/', function(req, res, next) {
  light = req.body.light;
  console.log("====================","Light",req.body.light,"====================");
  api.lightStatus(light).then(displayStatus).then(next).done();
});

router.post('/', function(req, res, next) {
  // console.log(JSON.stringify(req.body, null, 2));
  res.send(color_rgb);
});

module.exports = router;
