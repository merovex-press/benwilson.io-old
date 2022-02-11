const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const word_days = ['Tue', 'Thu', 'Sat']
const target = parseInt(document.getElementById('daily_target').value)
const padding = 4
const size = 12
const height = 10 * size
const width = 53 * size + 30
var last_week = 0;

// Vanilla js
function drawDay(ns, date, data) {
  var day_of_week = (date.getDay() || 7) - 1; // Moves Sunday to bottom; week start Monday
  var week = date.getWeek(1) + 1
  var y = ((day_of_week + 2) * size) + padding
  var x = week * size + padding + 30
  var value
  if (data != undefined) {
    value = data['words']
  }
  else {
    value = 0
  }

  var css_class; var level;
  switch (true) {
    case value > (target * 1.2):
      css_class = 'heatmap-5'
      break;
    case value > target:
      css_class = 'heatmap-4'
      break;
    case value > (target * 0.8):
      css_class = 'heatmap-3'
      break;
    case value > (target * 0.4):
      css_class = 'heatmap-2'
      break;
    default:
      css_class = 'heatmap-1'
  }
  var level = css_class.split('-')[1]
  css_class += " heatmap-day";

  var day = document.createElementNS(ns, 'rect');
  day.setAttributeNS(null, 'data-date', date.toISOString().split('T')[0])
  day.setAttributeNS(null, 'data-count', value)
  day.setAttributeNS(null, 'data-level', level)
  day.setAttributeNS(null, 'width', 10)
  day.setAttributeNS(null, 'height', 10)
  day.setAttributeNS(null, 'x', x)
  day.setAttributeNS(null, 'y', y)
  day.setAttributeNS(null, 'rx', 2)
  day.setAttributeNS(null, 'ry', 2)
  day.setAttributeNS(null, "class", css_class);
  day.setAttributeNS(null, "stroke-width", 1)
  return day;
}

function processHeatmap(data) {
  const ns = 'http://www.w3.org/2000/svg'
  const div = document.getElementById('heatmap')
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttributeNS(null, 'width', width)
  svg.setAttributeNS(null, 'height', height)
  svg.setAttributeNS(null, 'id', 'heatmap-svg')

  const rect = document.createElementNS(ns, 'rect');
  rect.setAttributeNS(null, "width", width)
  rect.setAttributeNS(null, "height", height)
  rect.setAttributeNS(null, 'rx', padding * 3)
  rect.setAttributeNS(null, 'ry', padding * 3)
  rect.setAttributeNS(null, "fill-opacity", "0")
  svg.appendChild(rect)

  const eoy = new Date();
  const nyd = new Date(new Date().getFullYear(), 0, 1);

  // console.log(sunday.toISOString().split('T')[0])
  for (var d = nyd; d <= eoy; d.setDate(d.getDate() + 1)) {
    svg.appendChild(drawDay(ns, d, heatmap[d.toISOString().split('T')[0]]))
  }
  for (var i = 0; i < months.length; i++) {
    var newText = document.createElementNS(ns, 'text')
    newText.setAttributeNS(null, "x", ((width - 30) / 12 * i) + size + 30);
    newText.setAttributeNS(null, "y", 20);
    newText.setAttributeNS(null, "class", 'heatmap-text')
    var textNode = document.createTextNode(months[i]);
    newText.appendChild(textNode);
    svg.appendChild(newText)
  }

  const y = [4 * size, 6 * size, 8 * size]
  for (var i = 0; i < word_days.length; i++) {
    var newText = document.createElementNS(ns, 'text')
    newText.setAttributeNS(null, "x", 10);
    newText.setAttributeNS(null, "y", y[i]);
    newText.setAttributeNS(null, "class", 'heatmap-text')
    var textNode = document.createTextNode(word_days[i]);
    newText.appendChild(textNode);
    svg.appendChild(newText)
  }
  div.appendChild(svg)
  document.querySelectorAll('.heatmap-day').forEach(function (day) {
    if (day.dataset.count > 0) {
      day.addEventListener('mouseover', createTip);
      day.addEventListener('mouseout', cancelTip);
    }
  });
}
