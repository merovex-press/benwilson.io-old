
var volumes;
$.getJSON("terradoma-volume-data.json", function (data) {
  volumes = data["volumes"];
});

function input(id) { return document.getElementById(id).value }
function showVolumeDetails() {
  var key = input('coordinate');
  if (key.length == 4) {
    var data = volumes[key];
    console.log(data)
    document.getElementById("bases").innerHTML = data["bases"]
    document.getElementById("factions").innerHTML = data["factions"]
    document.getElementById("location").innerHTML = data["location"]
    document.getElementById("name").innerHTML = data["name"]
    document.getElementById("orbits").innerHTML = data["orbits"]
    document.getElementById("star").innerHTML = data["star"]
    document.getElementById("temp").innerHTML = data["temp"]
    document.getElementById("trade_codes").innerHTML = data["trade_codes"]
    document.getElementById("travel_code").innerHTML = data["travel_code"]
    document.getElementById("uwp").innerHTML = data["uwp"]
  }
  routableVolumes()
}
function routableVolumes() {
  var key = input('coordinate');
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
  document.getElementById("routable_volumes").innerHTML = routable;
}
function setCoordinate(link) {
  coordinate = link.getAttribute("data-coordinate");
  document.getElementById('coordinate').value = coordinate
  showVolumeDetails()
}