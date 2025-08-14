window.onload = function () {
  /* eslint-disable no-console */
  console.log(window.parent.location.href);
  console.log(window.location.href);
  console.log(window.opener.location.href);
  document.getElementById('pageurl').innerHTML = window.location.href;
};

const form = document.querySelector("#reviewform");
async function sendData() {

  const formData = new FormData(form);

  console.log(formData.get("changeType"));
  console.log(formData.get("message"));
  console.log(formData.get("priority"));

console.log("inside send data");
const data = JSON.stringify({
    "pageUrl": document.getElementById('pageurl').innerHTML,
    "requestType": formData.get("changeType"),
    "criticality": formData.get("priority"),
    "comments": formData.get("message")
});
console.log("data",data);

  try {
    var req = new XMLHttpRequest();
  var url = "https://prod-43.usgovtexas.logic.azure.us/workflows/6414b37738a64ad1865219fdcf6bce9c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wuv2It6barW-w9zvAuFejn81kppwFGw0tBLqGnV0BSk";
  req.open("POST", url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(data);
 
  } catch (e) {
    console.error(e);
  }
};


// Take over form submission
form.addEventListener("submit", (event) => {
  console.log("submit");
 sendData();
});