document.addEventListener("DOMContentLoaded", function () {
  var wss = new WebSocket("ws://192.168.100.48:8001");

  wss.onmessage = function (e) {
    console.log("onmessage");
    dispCtnt(e.data);
  };

  wss.onopen = function (e) {
    console.log("onopen");
    console.log(e);
    dispCtnt("Connection established" + "<br>");
  };

  wss.onclose = function (e) {
    console.log("onclose");
    console.log(e);
    dispCtnt("Connection closed" + "<br>");
  };

  wss.onerror = function (e) {
    console.log("onerror");
    console.log(e);
  };

  async function saveLog(content, type) {
    try {
      const response = await fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: content, type: type }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error saving log:', error);
    }
  }

  function logAndSave(message, type) {
    originalConsoleLog(message);
    saveLog(message, type);
  }

  var originalConsoleLog = console.log;
  console.log = function (message) {
    logAndSave(message, 'log');
  };

  //#region send session
  document.getElementById("sendSess").addEventListener("click", function () {
    console.log("mt:LG");
    clrCtnt();
    wss.send(
      '{"data":{"16":"mt010","37":4325,"271":"505ae561111b6bfd3fad9f3badb0d8ca200eefaf1dfbb2310f58d6c710acbbba","64":196608,"65":3},"mt":"LG"}'
    );
    setInterval(sendAck, 5000);
    clrReqTxt();
  });

  document.getElementById("sendAck").addEventListener("click", function () {
    clrCtnt();
    sendAck();
    clrReqTxt();
  });

  //#region functions
  function sendAck() {
    console.log("mt:AC");
    wss.send('{"mt":"AC","data":{}}');
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
      var logEntry = `<span style="font-weight: bold; color: blue;">${timestamp}</span>: ${d}<br>`;
      ctnt.innerHTML += logEntry;
      logAndSave(logEntry, 'content');
    }
  }
});
