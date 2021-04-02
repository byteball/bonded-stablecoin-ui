export const updateProvider = ({ address, update = () => { }, handleSnapshot = () => { }, onError = () => { } }) => {
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
          handleSnapshot(data.snapshot.upcomingStateVars, data.snapshot.upcomingBalances);
        } else if ("update" in data) {
          update(data.update.upcomingStateVars, data.update.upcomingBalances);
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

