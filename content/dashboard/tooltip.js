function createTip(ev) {
  const msg = this.dataset.date + ": " + this.dataset.count + " words"
  document.getElementById("msg").innerHTML = msg
}
function cancelTip(ev) {
  document.getElementById("msg").innerHTML = ''
}