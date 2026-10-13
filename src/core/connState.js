const connState = {
  isOpen: false,
  isShuttingDown: false,
};

function setOpen() {
  connState.isOpen = true;
  connState.isShuttingDown = false;
}

function setClosed() {
  connState.isOpen = false;
}

function setShuttingDown() {
  connState.isShuttingDown = true;
}

module.exports = { connState, setOpen, setClosed, setShuttingDown };
