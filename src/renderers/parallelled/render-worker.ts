self.addEventListener('message', (data) => {

    self.postMessage(true);
}, false);