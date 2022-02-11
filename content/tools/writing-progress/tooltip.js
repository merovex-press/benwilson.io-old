function createTip(ev) {
  // const padding = 0;
  // const linkProps = this.getBoundingClientRect();
  const msg = this.dataset.date + ": " + this.dataset.count + " words"

  // const tooltip = document.createElement("div"); //creates div
  // tooltip.className = 'tooltip'; //adds class
  // tooltip.appendChild(document.createTextNode(msg)); //add the text node to the newly created div.

  // // Add the tooltip to the body
  // const child = document.body.firstChild
  // child.parentNode.insertBefore(tooltip, child)

  // // Position the tooltip near the data element
  // const tooltipProps = tooltip.getBoundingClientRect();
  // const topPos = linkProps.top - (tooltipProps.height + padding);
  // const leftPos = linkProps.left - (tooltipProps.width / 2);
  // tooltip.setAttribute('style', 'top:' + topPos + 'px;' + 'left:' + leftPos + 'px;')
  document.getElementById("msg").innerHTML = msg
}
function cancelTip(ev) {
  document.getElementById("msg").innerHTML = ''
}