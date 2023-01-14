const heatmapPopover = (function () {
  // Select all rect tags within the SVG
  var rects = document.querySelectorAll("svg rect.calgraph-day");
  if (!rects.length) {
    setTimeout(heatmapPopover, 100);
    return;
  }
  console.log('rects', rects.length)
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Add a hover event listener to each rect
  rects.forEach(function (rect) {
    rect.addEventListener("mouseenter", function () {
      // Get the data attributes
      var date = this.getAttribute("data-date");
      var level = this.getAttribute("data-level");
      var count = parseInt(this.getAttribute("data-count"));
      var terms = this.getAttribute("data-terms");
      var title = this.getAttribute("data-title");
      var tooltip = this.getAttribute("data-tooltip");

      if (count == 0) {
        return;
      }

      // Create the pop-over
      var popover = document.createElement("div");
      popover.classList.add("popover");
      var content = `<span>${count.toLocaleString()} on ${formatter.format(new Date(date))}</span>`
      // console.log('content', content)
      popover.innerHTML = content;

      document.body.appendChild(popover);

      // Position the pop-over
      var rectBounds = rect.getBoundingClientRect();
      console.log('rectBounds', rectBounds);
      popover.style.left = `${rectBounds.left + (rectBounds.width / 2) - (popover.offsetWidth / 2)}px`;
      popover.style.top = `${rectBounds.top - 10 - (popover.offsetHeight)}px`;
    });

    rect.addEventListener("mouseleave", function () {
      // Remove the pop-over when the user's cursor leaves the rect
      var popover = document.querySelector(".popover");
      if (popover) { document.body.removeChild(popover); }
    });
  });
});

