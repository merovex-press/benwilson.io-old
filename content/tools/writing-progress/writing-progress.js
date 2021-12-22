var uData;
var words = {}

$.getJSON("https://api.jsonbin.io/b/61c07f9a4359822986117df4", function (data) {
  uData = data["data"];
  Object.keys(uData).map(function (key) {
    var date = new Date(key + 'T06:20:30Z')
    var label = date.getMonday().toISOString().split('T')[0]
    if (!(label in words)) { words[label] = 0 }
    words[label] = words[label] + uData[key]['daily'];
    console.log('here', Object.keys(words), Object.values(words))
  })
  var ctx = document.getElementById('weekly-progress').getContext('2d');
  var options = {
    options: {
      maintainAspectRatio: false,
      scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
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