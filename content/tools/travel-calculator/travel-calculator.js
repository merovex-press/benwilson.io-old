// Thanks to https://spacetravel.simhub.online
// 
SPEED_OF_LIGHT_SQUARED = 89875517873681760;
SPEED_OF_LIGHT = 299792458;
ACCELERATION_IN_G = 0.0098
KM_PER_AU = 149597900
SUN_DIAMETER = 1390000
// Fuel Conversion Rate is HALF whatever is said in TNE: Fire, Fusion & Steel.
// FUEL_CONVERSION_RATE = 0.00125; // HEPlaR 
FUEL_CONVERSION_RATE = 0.0025; // M-Drive
// document.getElementById('noDeceleration').onclick = function () {
//   // access properties using this keyword
//   if (this.checked) {
//     // Returns true if checked
//     alert(this.value);
//   } else {
//     // Returns false if not checked
//   }
// };

// =================================================================================================
// Utilities
function acceleration() { return input("acceleration") * ACCELERATION_IN_G }
function acosh(arg) { return Math.log(arg + Math.sqrt(arg * arg - 1)); }
function format(n) { return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
function input(id) { return document.getElementById(id).value }
function setAU(km) {
  var au = km / KM_PER_AU
  switch (true) {
    case (au < 0.1): au = au.toFixed(3); break;
    case (au < 1): au = au.toFixed(2); break;
    case (au < 10): au = au.toFixed(1); break;
    default: au = au.toFixed(0); break;
  }
  document.getElementById("distanceAU").value = au
}
function setKM(km) { document.getElementById("distance").value = km }
function setGM(km) { document.getElementById("distanceGm").innerHTML = (km / 1000000).toFixed(2); }

function setLightSeconds(km) {
  var seconds = Math.round(km / 299792.558)
  document.getElementById("distanceLs").innerHTML = seconds;
  // mls
  document.getElementById("mls").innerHTML = Math.round(seconds / 0.864);
}
function setDistanceFromPlanetSize() {
  var km = document.getElementById("planet_size").value;
  setAU(km);
  setGM(km);
  setKM(km);
  setLightSeconds(km);
  calculate()
}
function setDistanceFromStarSize() {
  var stellar_size = document.getElementById("star_size").value;
  var km = stellar_size * SUN_DIAMETER * 100
  setKM(km);
  setGM(km);
  setAU(km);
  setLightSeconds(km);
  calculate()
}

function willDeclerate() {
  return !document.getElementById('noDeceleration').checked;
}
function fuel_conversion_rate() { return document.getElementById("fuel_conversion_rate").value }
// =================================================================================================
// Calculations
function calculate() {
  var ttSeconds = calcObserverTime()
  var mwh = calcMWHConsumed(ttSeconds)
  document.getElementById("travelTimeDmhs").innerHTML = secondsToDhms(ttSeconds) + secondsToCycles(ttSeconds);
  document.getElementById("fuelConsumed").innerHTML = format(calcFuelMass(ttSeconds))
  document.getElementById("mwConsumed").innerHTML = (mwh > 10) ? mwh.toFixed(0) : mwh.toFixed(2)
}
function calcMWHConsumed(ttSeconds) {
  var fc = 16000 * fuel_conversion_rate()
  var mass = input("spaceship_mass") / 200;
  // console.log(fc)
  var result = input("acceleration") * (mass / fc) * (ttSeconds / 3600);
  return result;
}
function calcFuelMass(ttSeconds) {
  // Liquid Hydrogen weighs 71kg
  // HEPlaR is 0.25 cubic meter of liquid hydrogen per Megawatt Hour

  // This is Traveller's computation
  // var mwHour = calcMWHConsumed(ttSeconds);
  // var efficiency = 0.25 // HEPlaR
  // var result = mwHour * 71.0 * efficiency;

  // This is a more scientific calculation.
  var mass = input("spaceship_mass") * 1000; // Mass in Metric tons to KGs
  var max_velocity = calcMaxVelocity(ttSeconds)
  var vel_to_c = max_velocity / SPEED_OF_LIGHT;
  var per_kg_100percent = 2 * vel_to_c / (1 - vel_to_c);
  return per_kg_100percent * mass / fuel_conversion_rate();
}

function calcObserverTime() {
  var k = SPEED_OF_LIGHT_SQUARED / acceleration();
  var k_over_a = k / acceleration();
  var sqrt_term_operand = Math.pow(input("distance") / (2 * k) + 1, 2);
  var sqrt_term = k_over_a * (sqrt_term_operand - 1);
  var result = 2 * Math.sqrt(sqrt_term);
  // document.getElementById("observerTime").innerHTML = result;
  return result;
}

function calcDistanceFromAcceleration() {
  var time = input("travel_time") * 60
  var speed = acceleration()
  var km = 0.5 * speed * Math.pow(time, 2)
  setKM(km);
  setGM(km);
  setLightSeconds(km);
  calcMaxVelocity(time * 2)
}
function calcDist(observerTime, velocity) {
  // Formula from:
  // http://www.mrelativity.net/MBriefs/Most%20Direct%20Derivation%20of%20Relativistic%20Constant%20Acceleration%20Distance%20Formula.htm
  // Which is:
  // distance = c*max_vel*T_obs / c + sqrt(c^2-max_vel^2)

  var numerator = SPEED_OF_LIGHT * velocity * observerTime;
  var lorentz = Math.sqrt(SPEED_OF_LIGHT_SQUARED - Math.pow(velocity, 2));
  var result = numerator / (SPEED_OF_LIGHT + lorentz);
  return result;
}
function calcMaxVelocity(time_elapsed) {
  var result = acceleration() * (time_elapsed / 2); // * 1000;
  document.getElementById("maxVelocity").innerHTML = result.toFixed(0);
  return result;
}
function setDistanceFromKM() {
  var km = document.getElementById("distance").value;
  setAU(km);
  setGM(km)
  setLightSeconds(km);
  calculate();
}
function setDistanceFromAU() {
  var au = document.getElementById("distanceAU").value;
  var km = au * 149597900
  // console.log(km, au);
  setKM(km);
  setGM(km)
  setLightSeconds(km);
  calculate();
}
function secondsToCycles(impSeconds) {
  seconds = Math.ceil(Number(impSeconds) / 0.864);
  var days = Math.floor(seconds / 100000)
  var cycles = Math.floor((seconds % 100000) / 10000);
  var beats = Math.floor(seconds % (10000) / 100);
  result = " <span class='block text-sm opacity-60 hover:opacity-100'>(" + days + "." + cycles + "." + beats + " days.cycles.beats)</span>";
  return result;
}
function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  var result = dDisplay + hDisplay + mDisplay + sDisplay;
  return result.replace(/, $/, "")
}
window.onload = function () {
  calculate();
  setDistanceFromKM();
}