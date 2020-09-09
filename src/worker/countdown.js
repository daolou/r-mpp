const workerScript = `
self.onmessage = function(event) {
  var num = event.data;

  var T = setInterval(function() {
    self.postMessage(--num);
    if (num <= 0) {
      console.log('clearInterval');
      clearInterval(T);
      self.close();
    }
  }, 1000);
};
`;
const workerScriptBlob = new Blob([workerScript]);
const workerScriptBlobUrl = URL.createObjectURL(workerScriptBlob);

export default workerScriptBlobUrl;
