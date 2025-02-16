document.addEventListener("DOMContentLoaded", function () {
  var wss = new WebSocket("ws://192.168.100.48:8001");

  wss.onmessage = function (e) {
    console.log("onmessage");
    console.log(e.data);
    dispCtnt(e.data);
    logEvent('received'); // Only logs type and timestamp, no data
  };

  wss.onopen = function (e) {
    console.log("onopen");
    console.log(e);
    dispCtnt("Connection established" + "<br>");
    logEvent('status', 'Connection established');
  };

  wss.onclose = function (e) {
    console.log("onclose");
    console.log(e);
    dispCtnt("Connection closed" + "<br>");
    logEvent('status', 'Connection closed');
  };

  wss.onerror = function (e) {
    console.log("onerror");
    console.log(e);
    logEvent('error', e);
  };

  //#region send session
  document.getElementById("sendSess").addEventListener("click", function () {
    console.log("mt:LG");
    clrCtnt();
    const message = '{"data":{"16":"mt010","37":4325,"271":"505ae561111b6bfd3fad9f3badb0d8ca200eefaf1dfbb2310f58d6c710acbbba","64":196608,"65":3},"mt":"LG"}';
    wss.send(message);
    logEvent('sent', message);
    setInterval(sendAck, 5000);
    clrReqTxt();
  });

  //#region functions
  function sendAck() {
    console.log("mt:AC");
    const ackMessage = '{"mt":"AC","data":{}}';
    wss.send(ackMessage);
    logEvent('sent', ackMessage);
  }

  function clrCtnt() {
    var ctnt = document.getElementById("ctnt");
    if (ctnt !== null) ctnt.innerHTML = "";
  }

  function clrReqTxt() {
    var msg = document.getElementById("msg");
    if (msg !== null) msg.value = "";
  }

  function dispCtnt(d) {
    var ctnt = document.getElementById("ctnt");
    if (ctnt !== null) {
      var timestamp = new Date().toLocaleString();
      ctnt.innerHTML += `<span style="font-weight: bold; color: blue;">${timestamp}</span>: ${d}<br>`;
    }
  }

  function logEvent(eventType, data = null) {
    const timestamp = new Date().toLocaleString();
    console.log("timestamp:", timestamp); // Debugging message
    const requestBody = data ? { timestamp, type: eventType, data } : { timestamp, type: eventType };
    
    fetch('http://localhost:3000/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save log');
      }
      return response.text();
    })
    .then(data => console.log("Log saved:", data)) // Debugging message
    .catch(error => console.error("Error logging event:", error));
  }
});
