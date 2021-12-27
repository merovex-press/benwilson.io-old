
var volumes;
$.getJSON("terradoma-volume-data.json", function (data) {
  volumes = data["volumes"];
});

var uData;
$.getJSON("../uwp-translator/uwp-translator.json", function (data) { uData = data["data"]; });

function getSVal(key) { return $("input[id^='" + key + "']").val(); }
function setVal(key, value) { $("input[id=" + key + "]").val(value); }
function input(id) { return $(id).value }
function translateUWP(sname, uwp) {
  var bits = uwp.toUpperCase().split('')
  console.log(uwp, bits)
  uwpOutput = [];
  // alert( uwpStarport)
  uwpOutput.push(sname + " " + uData['port'][bits[0]])    // Starport

  // Planetary Size
  s = uData['size'][bits[1]]
  uwpOutput.push("The main world is roughly " + s[1] + " kilometers in diameter, and is <strong>" + s[0] + "</strong>")

  // Atmosphere
  uwpOutput.push(uData['atmos'][bits[2]])

  // Hydrosphere
  s = uData['hydro'][bits[3]]
  uwpOutput.push("The surface is roughly " + s[0] + " percent surface water (or similar fluid), which qualifies it as a <strong>" + s[1] + "</strong> world")

  // Population
  s = uData['pop'][bits[4]]
  uwpOutput.push("The main world has a general population of " + s[1] + " local residents, which qualifies it as a <strong>" + s[0] + " population</strong> world")

  // Government
  s = uData['govt'][bits[5]]
  uwpOutput.push("The local government is characterized as <strong>" + s[0] + "</strong>, with " + s[1])

  // Law level
  s = uData['law'][bits[6]]
  uwpOutput.push("Visitors may find the law " + s[0] + "restrictive as <strong>" + s[1] + "</strong> are regulated or restricted by local authorities")
  // Tech level
  s = uData['tech'][bits[8]]
  uwpOutput.push("Technology is described as " + s + " (See <a href='http://wiki.travellerrpg.com/Tech_Level_Comparison_Chart'>TL chart</a>)")

  $('#uwp-output').html(uwpOutput.join(".\n") + ".")
}
function showVolumeDetails() {
  var key = getSVal('coordinate')
  if (key.length != 4) { return; }

  var data = volumes[key];
  console.log(data)
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
function routableVolumes(key) {
  if (key.length != 4) { return; }

  var routable = ""
  var x = parseInt(key.slice(0, 2))
  var y = parseInt(key.slice(2))
  var p = 0

  for (var j = (y - 3); j <= (y + 3); j++) {
    for (var i = (x - 3); i <= (x + 3); i++) {
      var distance = Math.abs(x - i) + Math.abs(y - j)
      if (distance > 4) { continue; }

      var xkey = i.toString().padStart(2, '0') + j.toString().padStart(2, '0')
      if (xkey == key) { continue; }
      if (volumes[xkey] != undefined) {
        var v = volumes[xkey]
        var locx = "<a data-coordinate='" + xkey + "' onclick='setCoordinate(this)'>" + xkey + "</a> : " + v["uwp"] + " - " + v["name"]
        routable += "<li>" + locx + "</li>\n"
      }
      p = p++
      if (p > 100) { break; }
    }
  }
  $("#routable_volumes").html(routable);
}
function setCoordinate(link) {
  coordinate = link.getAttribute("data-coordinate");
  setVal('coordinate', coordinate)
  showVolumeDetails()
}