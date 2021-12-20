var uData;
$.getJSON("/assets/js/uwp-translator.json", function (data) { uData = data["data"]; });

$("#uwp").focus();
$('#uwp').keyup(function (event) { translateUWP(); }); translateUWP();

function getSVal(key) { return $("input[id^='" + key + "']").val(); }
function setVal(key, value) { $("input[id=" + key + "]").val(value); }
function translateUWP() {
  var uwpOutput = getSVal('uwp-output');
  var uwp = getSVal('uwp');
  var sname = getSVal('n');
  if (sname == '') { sname = uwp }
  bits = uwp.split('');

  if (bits[7] == '-') {

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
    $('#uwp-code').html(uwp)
    $('#uwp-output').html(uwpOutput.join(".\n") + ".")
  }
}