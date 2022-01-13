var uData;
// var cumulative 

const WRITING_DAYS = 6;
const MAX_RANGE = 365;
const VALUE_COMPLETION = 85000 * 2 - 24466;
const PLANNED_COMPLETION = new Date(2022, 5, 30)

var words = {}
var earned_value = 0; // Words from the earlier draft
var days_writing = 0;
var today = new Date();
var start_date = new Date();

$.getJSON("writing-progress.json", function (data) {
  uData = data["data"];
  Object.keys(uData).map(function (key) {
    var date = new Date(key + 'T06:20:30Z')
    if (date < start_date) { start_date = date; }

    if (uData[key]['daily'] > 0 && today.between(date) < MAX_RANGE) {
      var label = date.getMonday().toISOString().split('T')[0]
      if (!(label in words)) { words[label] = 0 }
      words[label] = words[label] + uData[key]['daily'];
      earned_value = earned_value + uData[key]['daily'];
      days_writing = days_writing + 1;
    }
  })

  var days_lapsed = today.between(start_date)

  // Convert this to Earned Value terminology
  var planned_value = (VALUE_COMPLETION / PLANNED_COMPLETION.between(start_date)) * today.between(start_date)
  var schedule_variance = earned_value - planned_value
  var remaining_work = (VALUE_COMPLETION - earned_value) // How many words to I need to write to finish?
  var average = earned_value / days_writing; // What is my current daily average?
  var days_pace = Math.round(remaining_work / average); // At current writing pace, how many days will it take?
  var target_date = today.addDays(days_pace)// Based on this, when will I likely finish?
  var days_remaining = PLANNED_COMPLETION.between(today).formatted(); // How many actual days remain?

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

  // Writing Pace
  document.getElementById("average").innerHTML = average.rounded().formatted();
  document.getElementById("revised-pace").innerHTML = revised_pace;
  document.getElementById("days-writing-variance").innerHTML = days_lapsed - days_writing;
  document.getElementById("days-pace").innerHTML = days_pace;
  document.getElementById("days-lapsed").innerHTML = days_lapsed.formatted();
  document.getElementById("days-remaining").innerHTML = PLANNED_COMPLETION.between(today).rounded().formatted();
  document.getElementById("days-writing").innerHTML = days_writing.formatted();
  document.getElementById("days-writing-variance-percent").innerHTML = ((days_lapsed - days_writing) * 100 / days_lapsed).rounded();

  var ctx = document.getElementById('weekly-progress').getContext('2d');
  var options = {
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
});

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
Number.prototype.rounded = function () {
  return Math.round(this.valueOf());
}
Number.prototype.formatted = function () {
  return this.toLocaleString("en-US")
}