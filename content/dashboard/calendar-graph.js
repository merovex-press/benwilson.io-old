class CalendarGraph {
  // calgraph-1
  // calgraph-2
  // calgraph-3
  // calgraph-4
  // calgraph-5
  constructor(options) {
    this.ns = 'http://www.w3.org/2000/svg'
    this.size = options.size || 9.7
    this.target = options.target || 1000;
    this.data = options.data || {};
    this.padding = options.padding || 2;
    this.rounding = options.rounding || 2;
    this.terms = options.terms || 'words';
    this.breakpoints = options.breakpoints || [0.6, 1.2]
    this.css_class = options.css_class || 'calgraph'

    this.offset = [25, 20]; // Y & X offsets
    this.fullsize = this.size + this.padding;
    this.svgsize = [
      this.fullsize * 53 + (this.offset[0] * 2),
      this.fullsize * 11
    ]
  }
  createCell(x, y) {
    const cell = document.createElementNS(this.ns, 'rect');
    cell.setAttributeNS(null, 'width', this.size);
    cell.setAttributeNS(null, 'height', this.size);
    cell.setAttributeNS(null, 'x', x);
    cell.setAttributeNS(null, 'y', y);
    cell.setAttributeNS(null, 'rx', this.rounding);
    cell.setAttributeNS(null, 'ry', this.rounding);
    cell.setAttributeNS(null, "stroke-width", 1);
    return cell;
  };

  drawAxis() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const word_days = ['Tue', 'Thu', 'Sat']
    const axis = document.createElementNS(this.ns, 'g');
    for (var i = 0; i < months.length; i++) {
      var newText = document.createElementNS(this.ns, 'text')
      newText.setAttributeNS(null, "x", ((this.svgsize[0] - this.offset[0]) / 12 * i) + this.size + this.offset[0]);
      newText.setAttributeNS(null, "y", 20);
      newText.setAttributeNS(null, "class", 'calgraph-text')
      var textNode = document.createTextNode(months[i]);
      newText.appendChild(textNode);
      axis.appendChild(newText)
    }
    const y = [4 * this.fullsize, 6 * this.fullsize, 8 * this.fullsize]
    for (var i = 0; i < word_days.length; i++) {
      var newText = document.createElementNS(this.ns, 'text')
      newText.setAttributeNS(null, "x", 10);
      newText.setAttributeNS(null, "y", y[i] - 2);
      newText.setAttributeNS(null, "class", 'calgraph-text')
      var textNode = document.createTextNode(word_days[i]);
      newText.appendChild(textNode);
      axis.appendChild(newText)
    }
    var newText = document.createElementNS(this.ns, 'text')
    newText.setAttribute('id', 'cg-msg')
    newText.setAttribute("x", 10);
    newText.setAttribute('y', this.svgsize[1] - 15)
    newText.setAttribute('class', 'calgraph-text-bold');
    newText.setAttributeNS(null, 'text-anchor', 'start')
    newText.setAttributeNS(null, 'alignment-baseline', 'baseline')
    newText.appendChild(document.createTextNode(''));
    axis.appendChild(newText)
    return axis;
  }
  drawLegend() {
    const legend_y = this.svgsize[1] - 15;
    let legend_x = this.svgsize[0] - 115;
    const legend = document.createElementNS(this.ns, 'g')
    legend.setAttributeNS(null, 'x', legend_x)
    legend.setAttributeNS(null, 'y', legend_y)

    const less = document.createElementNS(this.ns, 'text')
    less.appendChild(document.createTextNode('Less'));
    less.setAttributeNS(null, "x", legend_x - 2)
    less.setAttributeNS(null, 'y', legend_y)
    less.setAttribute('class', 'calgraph-text-bold');
    less.setAttributeNS(null, 'text-anchor', 'middle')
    less.setAttributeNS(null, 'alignment-baseline', 'baseline')
    legend.appendChild(less);

    const cells = [
      'calgraph-1',
      'calgraph-2',
      'calgraph-3',
      'calgraph-4',
      'calgraph-5'
    ]
    let cell_x = this.fullsize;
    let key = null;
    cells.forEach((item, idx) => {
      legend_x += this.fullsize
      key = this.createCell(legend_x, legend_y)
      key.setAttribute('class', item)
      legend.appendChild(key);
    });

    legend_x += this.fullsize
    const moar = document.createElementNS(this.ns, 'text')
    moar.appendChild(document.createTextNode('More'));
    moar.setAttributeNS(null, "x", legend_x)
    moar.setAttributeNS(null, 'y', legend_y)
    moar.setAttribute('class', 'calgraph-text-bold')
    moar.setAttributeNS(null, 'alignment-baseline', 'baseline')
    legend.appendChild(moar);
    return legend;
  }
  drawDay(date, data) {
    var day_of_week = (date.getDay() || 7) - 1; // Moves Sunday to bottom; week start Monday
    var week = date.getWeek(1) + 1
    var y = day_of_week * this.fullsize + this.offset[0]
    var x = week * this.fullsize + this.offset[1]
    var value = (data != undefined) ? data['words'] : 0;

    var css_class; var level;
    switch (true) {
      case value > (this.target * Math.max(...this.breakpoints)):
        css_class = 'calgraph-5'
        break;
      case value > this.target:
        css_class = 'calgraph-4'
        break;
      case value > (this.target * Math.min(...this.breakpoints)):
        css_class = 'calgraph-3'
        break;
      case value > 0:
        css_class = 'calgraph-2'
        break;
      default:
        css_class = 'calgraph-1'
    }
    var level = css_class.split('-')[1]

    const day = this.createCell(x, y);
    day.setAttributeNS(null, 'data-date', date.toISOString().split('T')[0]);
    day.setAttributeNS(null, 'data-terms', this.terms);
    day.setAttributeNS(null, 'data-count', value);
    day.setAttributeNS(null, 'data-level', level);
    day.setAttributeNS(null, "class", `${this.css_class}-${level}` + " calgraph-day");
    return day;
  }
  render() {
    const div = document.getElementById('heatmap')
    const svg = document.createElementNS(this.ns, 'svg')

    svg.setAttributeNS(null, 'width', this.svgsize[0])
    svg.setAttributeNS(null, 'height', this.svgsize[1])
    svg.setAttributeNS(null, 'id', 'calgraph');
    svg.setAttributeNS(null, 'class', 'bg-gray-50 dark:bg-gray-900 rounded mx-auto');
    svg.setAttributeNS(null, 'overflow', 'hidden')
    svg.setAttributeNS(this.ns, 'viewbox', '0 0 ' + this.svgsize[0] + ' ' + this.svgsize[1] + ' 200')

    // const now = new Date();
    const eoy = new Date(new Date().getFullYear(), 11, 31);
    // console.log(eoy)
    const nyd = new Date(new Date().getFullYear(), 0, 1);
    for (var d = nyd; d <= eoy; d.setDate(d.getDate() + 1)) {
      svg.appendChild(this.drawDay(d, this.data[d.toISOString().split('T')[0]]))
    }

    svg.appendChild(this.drawAxis())
    svg.appendChild(this.drawLegend())
    div.appendChild(svg)
    document.querySelectorAll('.calgraph-day').forEach(function (day) {
      if (day.dataset.count > 0) {
        day.addEventListener('mouseover', cgCreateTip);
        day.addEventListener('mouseout', cgCancelTip);
      }
    });
  }
}
function cgCreateTip(ev) {
  document.getElementById("cg-msg").innerHTML = `${this.dataset.date}: ${this.dataset.count} ${this.dataset.terms}`
}
function cgCancelTip(ev) {
  document.getElementById("cg-msg").innerHTML = ''
}