var tries = 5;

var data;

fetch('dashboard.json')
  .then(res => res.json())
  .then(json => {
    console.log('fetch', json);
    data = json;
  })
  .catch(err => console.log('err', err));

function checkWordcount() {
  // if wordcount is undefined, wait a second and check again before continuing
  if (data === undefined) {
    setTimeout(function () { checkWordcount(); }, 100);
  } else {
    updateDashboard(data);
  }
}

function updateDashboard(data) {
  console.log('d', data);
  // do stuff
  // document.getElementById("annual-wordcount").innerHTML = parseInt(data.annual_progress).formatted();
  document.getElementById("annual-wordcount").innerHTML = parseInt(data.current_year).formatted();
  document.getElementById("weekly-annual-wordcount").innerHTML = parseInt(data.current_year).formatted();
  document.getElementById("current-week").innerHTML = parseInt(data.current_week).formatted();
  document.getElementById("last-week").innerHTML = parseInt(data.last_week).formatted();
}

const openSVG = (id, svgUrl) => {
  const placeholder = document.getElementById(id);

  const request = new XMLHttpRequest();
  request.open('GET', svgUrl, true);
  request.send();

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      try {
        const svg = request.responseXML.documentElement;
        placeholder.parentNode.replaceChild(svg, placeholder);
        // do something with the SVG
      } catch (error) {
        if (error instanceof TypeError) {
          console.error('Failed to retrieve SVG:', error, tries);
        } else {
          throw error;
        }
        tries -= 1;
        if (tries > 0) {
          setTimeout(() => openSVG(id, svgUrl), 1000);
        }

      }
      // console.log("request", svgUrl)
      // const svg = request.responseXML.documentElement;
      // console.log(svgUrl, svg);
    }
  }
}

window.onload = () => {
  checkWordcount();
  openSVG('heatmap-svg', './heatmap.svg');
  openSVG('annual-svg', './annual.svg');
  openSVG('weekly-annual-svg', './weekly_annual.svg');
  openSVG('this-week-svg', './current_week.svg');
  openSVG('last-week-svg', './last_week.svg');
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