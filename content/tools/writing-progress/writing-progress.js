var uData;
// var cumulative 
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLRpcIxa0g_05ihkg8dAa796YSqKW-hsIbj8KNyG-yveb7LMhKl-9NVivzPf64ejc7bRdnwwyLl-cx/pub?gid=0&single=true&output=csv"
const WRITING_DAYS = 6;
const MAX_RANGE = 366;
const today = new Date();

var words = {}
var hours = []
var earned_value = 0; // Words from the earlier draft
var days_writing = 0;
var total_hours = 0;

var start_date = new Date();

Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function (results) {
    results.data.forEach(row => {
      var date = new Date(row.date + 'T06:20:30Z')
      if (date < start_date) { start_date = date; }

      if (parseInt(row.words) > 0 && today.between(date) < MAX_RANGE) {
        var label = date.getMonday().toISOString().split('T')[0]
        if (!(label in words)) { words[label] = 0 }
        words[label] = words[label] + parseInt(row.words);
        earned_value = earned_value + parseInt(row.words);
        total_hours = total_hours + parseFloat(row.hours);
        hours.push(parseFloat(row.hours))
        days_writing = days_writing + 1;
        document.getElementById('last_date').innerHTML = date
        row.monday = label
      }
      console.log(row)
    })
    calculateProgress()
    generateChart()
  }
})

function calculateProgress() {

  const target_value = document.getElementById('value_completion').value
  const prior_value = document.getElementById('prior_value').value
  const VALUE_COMPLETION = target_value - prior_value
  const PLANNED_COMPLETION = new Date(2022, 5, 30)
  const days_lapsed = today.between(start_date)
  const session_average = hours.reduce((a, b) => a + b) / hours.length

  // Convert this to Earned Value terminology
  const planned_value = (VALUE_COMPLETION / PLANNED_COMPLETION.between(start_date)) * today.between(start_date)
  const schedule_variance = earned_value - planned_value
  const remaining_work = (VALUE_COMPLETION - earned_value) // How many words to I need to write to finish?
  const average = earned_value / days_writing; // What is my current daily average?
  const days_pace = Math.round(remaining_work / average); // At current writing pace, how many days will it take?
  const target_date = today.addDays(days_pace)// Based on this, when will I likely finish?
  const days_remaining = PLANNED_COMPLETION.between(today).formatted(); // How many actual days remain?

  const words_per_hour = earned_value / total_hours

  const hours_remaining = remaining_work / words_per_hour;
  const wp_session = words_per_hour * session_average;
  const relative_variance = schedule_variance / wp_session;

  // Am I at risk of missing my date?
  if (PLANNED_COMPLETION < target_date) {
    document.getElementById("tracking-late").innerHTML = "Late:"
    document.getElementById("tracking-state").classList.add('bg-warning-light')
  }
  // How fast do I need to write?
  var revised_pace = Math.round(remaining_work / days_remaining).formatted(); // words left / days left

  // Update the HTML
  // EVM Table
  document.getElementById("earned-value").innerHTML = earned_value.formatted();
  document.getElementById("planned-value").innerHTML = planned_value.rounded().formatted();
  document.getElementById("schedule-variance").innerHTML = schedule_variance.rounded().formatted();
  document.getElementById("remaining-work").innerHTML = remaining_work.formatted();
  document.getElementById("planned-date").innerHTML = PLANNED_COMPLETION.toString()
  document.getElementById("tracking-date").innerHTML = target_date.toString()
  document.getElementById("total-hours").innerHTML = total_hours.rounded().toString()
  document.getElementById("average-hours").innerHTML = session_average.rounded(1).toString()
  document.getElementById("wph").innerHTML = words_per_hour.rounded().toString();
  document.getElementById("hours-remaining").innerHTML = hours_remaining.rounded().toString();
  document.getElementById("relative-schedule-variance").innerHTML = relative_variance.ceiling().toString();

  // Writing Pace
  document.getElementById("average").innerHTML = average.rounded().formatted();
  document.getElementById("revised-pace").innerHTML = revised_pace;
  document.getElementById("days-writing-variance").innerHTML = days_lapsed - days_writing;
  document.getElementById("days-pace").innerHTML = days_pace;
  document.getElementById("days-lapsed").innerHTML = days_lapsed.formatted();
  document.getElementById("days-remaining").innerHTML = PLANNED_COMPLETION.between(today).rounded().formatted();
  document.getElementById("days-writing").innerHTML = days_writing.formatted();
  document.getElementById("days-writing-variance-percent").innerHTML = ((days_lapsed - days_writing) * 100 / days_lapsed).rounded();
}


function generateChart() {
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
        data: Object.values(words)
      }],
      labels: Object.keys(words)
    }
  }
  new Chart(ctx, options);
}



Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear = ((today - onejan + 86400000) / 86400000);
  return Math.ceil(dayOfYear / 7)
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
Date.prototype.toString = function (days) {
  return this.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
}
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