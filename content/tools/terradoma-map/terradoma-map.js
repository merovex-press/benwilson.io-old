
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
}