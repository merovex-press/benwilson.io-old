var uData;
// var cumulative 
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLRpcIxa0g_05ihkg8dAa796YSqKW-hsIbj8KNyG-yveb7LMhKl-9NVivzPf64ejc7bRdnwwyLl-cx/pub?gid=0&single=true&output=csv"
const WRITING_DAYS = 6;
const MAX_RANGE = 366;
const today = new Date();

var weekly = {}
var heatmap = {}
var hours = []
var earned_value = 0; // Words from the earlier draft
var days_writing = 0;
var total_hours = 0;
var monthly_words = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var progress = 0;
var percent_complete = 0;

var target_length = 0;
var remaining = 0;
var days_writing = 1;

var start_date = new Date();
function checkRow(row) {
  if (row.date == "") return false;
  if (row.date == "") return false;
  return true
}

Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function (results) {
    results.data.filter(checkRow).forEach(row => {
      var date = new Date(row.date + 'T06:20:30Z')
      var day_label = date.toISOString().split('T')[0]
      var week_label = date.getMonday().toISOString().split('T')[0]

      if (date < start_date) { start_date = date; }

      if (parseInt(row.words) > 0 && today.between(date) < MAX_RANGE) {

        // Build monthly report
        var month_ixs = date.getMonth();
        monthly_words[month_ixs] += parseInt(row.words)

        // Build weekly chart data
        if (!(week_label in weekly)) { weekly[week_label] = 0 }
        weekly[week_label] = weekly[week_label] + parseInt(row.words);

        // Build Heatmap data
        heatmap[day_label] = { 'words': parseInt(row.words) }

        earned_value = parseInt(row.progress);
        total_hours = total_hours + parseFloat(row.hours);
        hours.push(parseFloat(row.hours))

        document.getElementById('last_date').innerHTML = date
        target_length = parseInt(row.target)
        remaining = parseInt(row.remaining)
        row.monday = week_label

        percent_complete = parseFloat(row.percentComplete) * 100
      }
    })
    days_writing = Object.values(heatmap).length
    // console.log(days_writing)

    setProgressBar(percent_complete)

    generateChart(weekly)
    processHeatmap(heatmap)

    var session_average = 0;
    if (Object.keys(heatmap).length > 10) {
      var slice = Object.values(heatmap).splice(-10, 10)
    }
    else {
      var slice = Object.values(heatmap)
    }
    slice.forEach(value => {
      session_average += parseInt(value['words'])
    })
    session_average = parseInt(session_average / slice.length)

    document.getElementById('session-average').innerHTML = session_average.formatted()
    generateGauge(session_average)
    calculateProgress({
      average: session_average,
      remaining: remaining,
      count: days_writing,
      words: earned_value
    })
  }
})
function generateGauge(words) {
  var opts = {
    angle: 0.15, // The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
      length: 0.6, // // Relative to gauge radius
      strokeWidth: 0.035, // The thickness
      color: '#000000' // Fill color
    },
    staticZones: [
      { strokeStyle: "#D07C73", min: 0, max: 1000 }, // Red from 100 to 130
      { strokeStyle: "#69C67A", min: 1000, max: 1250 }, // Green
      { strokeStyle: "#9CA8DB", min: 1250, max: 3000 }, // Yellow
    ],
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    // colorStart: '#6FADCF',   // Colors
    // colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support

  };
  var target = document.getElementById('gauge'); // your canvas element
  var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
  gauge.maxValue = 3000; // set max gauge value
  gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
  gauge.animationSpeed = 32; // set animation speed (32 is default value)
  gauge.set(words); // set actual value
}
function setProgressBar(percent) {
  var bar = document.getElementById("progress-bar")
  bar.innerHTML = "WIP " + percent + "%"
  bar.setAttribute('style', 'width: ' + percent + '%;')
}
function calculateProgress(data) {
  const days_pace = Math.ceil(data.remaining / data.average); // At current writing pace, how many days will it take?
  const target_date = today.addDays(days_pace) // Based on this, when will I likely finish?
  const words_per_hour = parseInt(data.words / data.count)
  const days_remaining = data.remaining / words_per_hour;

  document.getElementById("earned-value").innerHTML = data.words.formatted();
  document.getElementById("tracking-date").innerHTML = target_date.toLocaleDateString('en-us', { month: "short", day: "numeric" });
  document.getElementById("total-days").innerHTML = data.count.rounded().toString()
  document.getElementById("days-remaining").innerHTML = days_remaining.rounded().toString();
}

function generateChart(data) {
  const ctx = document.getElementById('weekly-progress').getContext('2d');
  const options = {
    options: {
      maintainAspectRatio: false,
      scales: { y: { ticks: { beginAtZero: true } } }
    },
    data: {
      datasets: [{
        type: 'bar',
        label: 'Words per Week',
        borderWidth: 3,
        borderColor: ['RGBA(64, 110, 166, 1)'],
        backgroundColor: ['RGBA(64, 110, 166, 0.7)'],
        data: Object.values(data),

      }],
      options: {
        plugins: {
          legend: {
            display: false,
          }
        }
      },
      labels: Object.keys(data)
    }
  }
  // console.log(options);
  new Chart(ctx, options);
}

Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = (day >= 0 ? day : day + 7);
  var daynum = Math.floor((this.getTime() - newYear.getTime() -
    (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
        the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  }
  else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};
Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
Date.prototype.getMonday = function () {
  var mDifference = this.getDay() - 1;
  if (mDifference < 0) { mDifference += 7; }
  return new Date(this.addDays(mDifference * -1));
}
Date.prototype.getThursday = function () {
  var mDifference = this.getDay() - 4;
  if (mDifference < 0) { mDifference += 7; }
  return new Date(this.addDays(mDifference * -1));
}
Date.prototype.between = function (date) {
  return (Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()) - Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) / 24 / 60 / 60 / 1000;
}
Date.prototype.dayOfYear = function () {
  return (Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()) - Date.UTC(this.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}
Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
Date.prototype.toString = function () {
  return this.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
}
// Date.prototype.shortDate = function () {
//   this.toLocaleDateString('en-us', { month: "short", day: "numeric" });
// }
Number.prototype.rounded = function (length = 0) {
  if (length > 0) {
    return this.valueOf().toFixed(length);
  }
  return Math.round(this.valueOf(), length);
}
Number.prototype.formatted = function () {
  return this.toLocaleString("en-US")
}
Number.prototype.ceiling = function () {
  return Math.ceil(this)
}