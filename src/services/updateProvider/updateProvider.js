export const updateProvider = ({ address, update = () => { }, getSnapshot = () => { }, onError = () => { } }) => {
  const startWebsocket = () => {
    let ws = new WebSocket(address);
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
      ws = null
      setTimeout(startWebsocket, 500)
    }
  }
  startWebsocket();
}

