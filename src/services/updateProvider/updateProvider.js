export const updateProvider = ({ address, update = () => { }, getSnapshot = () => { }, onError = () => { } }) => {
  let heartbeat;
  const startWebsocket = () => {
    let ws = new WebSocket(address);
    ws.onopen = () => {
      heartbeat = setInterval(() => { ws.send('{"kind":"ping"}') }, 10 * 1000);
    }
    ws.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        if ("snapshot" in data) {
          getSnapshot(data.snapshot.upcomingStateVars);
        } else if ("update" in data) {
          update(data.update.upcomingStateVars);
        }
      } catch (e) {
        onError(e);
      }
    }
    ws.onclose = function () {
      clearInterval(heartbeat);
      ws = null
      onError();
      setTimeout(startWebsocket, 5000)
    }
  }
  startWebsocket();
}

