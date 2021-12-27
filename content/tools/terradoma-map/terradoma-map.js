String.prototype.format = function () {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}
var volumes;
$.getJSON("terradoma-volume-data.json", function (data) { volumes = data["volumes"]; });

var uData;
var uTemplates;
$.getJSON("../uwp-translator/uwp-translator.json", function (data) { uData = data["data"]; uTemplates = data["templates"]; });

function getSVal(key) { return $("input[id^='" + key + "']").val(); }
function setVal(key, value) { $("input[id=" + key + "]").val(value); }
function input(id) { return $(id).value }
function translateUWP(sname, uwp) {
  var keys = uwp.toUpperCase().split('')

  $('#uwp-output').html(
    [
      ['name', [sname, uData['port'][keys[0]]]],
      ['size', uData['size'][keys[1]]],
      ['atmos', [uData['atmos'][keys[2]]]],
      ['hydro', uData['hydro'][keys[3]]],
      ['pop', uData['pop'][keys[4]]],
      ['govt', uData['govt'][keys[5]]],
      ['law', uData['law'][keys[6]]],
      ['tech', [uData['tech'][keys[8]]]],
    ].map(function (item) {
      return uTemplates[item[0]].format(...item[1])
    }).join("\n")
  )
}
function showVolumeDetails() {
  var key = getSVal('coordinate')
  if (key.length != 4 || volumes[key] == undefined) { return; }

  var data = volumes[key];
  $("#bases").html(data["bases"])
  $("#factions").html(data["factions"])
  $("#location").html(data["location"])
  $("#name").html(data["name"])
  $("#orbits").html(data["orbits"])
  $("#star").html(data["star"])
  $("#temp").html(data["temp"])
  $("#trade_codes").html(data["trade_codes"])
  $("#travel_code").html(data["travel_code"])
  $("#uwp").html(data["uwp"])

  routableVolumes(key)
  translateUWP(data["name"], data["uwp"])
}
function center_of(column, row) {
  var side = 40
  var factor = 1.732
  var x = (side + ((column - 1) * side * 1.5)).toFixed(0)
  var y = ((row - 1) * side * factor + (side * factor / (1 + (column % 2)))).toFixed(0)
  return [x, y]
}
function calcSlope(origin, point) {
  return Math.round((point[1] - origin[1]) / (point[0] - origin[0]) * 10)
}
function calcDistance(origin, point) {
  return Math.sqrt(Math.pow(origin[0] - point[0], 2) + Math.pow(origin[1] - point[1], 2))
}
function calcQuadrant(origin, point) {
  var x = point[0] - origin[0]
  var y = point[1] - origin[1]
  switch (true) {
    case (x >= 0) && (y <= 0): return 1; break; // 1 = x pos, y pos
    case (x <= 0) && (y <= 0): return 2; break; // 2 = x neg, y pos
    case (x <= 0) && (y >= 0): return 3; break; // 3 = x neg, y neg
    case (x >= 0) && (y >= 0): return 4; break; // 4 = x pos, y neg
    default: return 5
  }
}
function routableVolumes(key) {
  if (key.length != 4) { return; }
  var routes = {}
  var route = "<tr class='text-center bg-brand bg-opacity-20'><td><a data-coordinate='{0}' onclick='setCoordinate(this)'>{1}</a></td><td>{2}</td><td>{3}</td><td>{4}</td></tr>\n"

  var x = parseInt(key.slice(0, 2))
  var y = parseInt(key.slice(2))
  var origin = center_of(x, y)

  var p = 0 // Failsafe in case the for loops get out of control. It has happened.

  for (var j = (y - 3); j <= (y + 3); j++) {
    for (var i = (x - 3); i <= (x + 3); i++) {

      var xkey = i.toString().padStart(2, '0') + j.toString().padStart(2, '0') // Printed coordinates

      var point = center_of(i, j)
      var distance = calcDistance([x, y], [i, j]) // We need unadjusted coordinates.
      var quadrant = calcQuadrant(origin, point)
      var slope = calcSlope(origin, point)

      // Process routes to habited volumes if within Jump-3 (a bit of rounding required)
      if (0 < distance && distance < 3.605 && volumes[xkey] != undefined) {
        // Exclude the farther route of two candidate routes in the same direction.
        var direction = "{0}:{1}".format(quadrant, slope)
        if (direction in routes && distance > routes[direction][0]) {
          continue;
        }

        // Capture the route information
        routes[direction] = [distance, xkey, route.format(
          xkey, xkey, volumes[xkey]['uwp'], Math.round(distance), volumes[xkey]['name']
        )]
      }

      if (p++ > 100) { break; }
    }
  }
  var result = "";
  for (key in routes) { result += routes[key][2] }
  $("#routable_volumes").html(result);
}
function setCoordinate(link) {
  coordinate = link.getAttribute("data-coordinate");
  setVal('coordinate', coordinate)
  showVolumeDetails()
}