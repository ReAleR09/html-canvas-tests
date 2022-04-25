self.addEventListener('message', ({render}) => {
    render();
    self.postMessage(true);
}, false);