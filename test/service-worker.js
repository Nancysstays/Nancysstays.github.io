self.addEventListener('message', function(event) {
  if (event.data.action === 'myAction') {
    // 3. Perform operation in service worker (e.g., fetch data, store in cache)
    const result = performSomeOperation(event.data.data);

    // 4. Send response back to the script
    event.source.postMessage({
      action: 'myActionResult',
      result: result
    });
  }
});

function performSomeOperation(data) {
  // Perform your operation here (e.g., fetch from API, access cache)
  // ...
  return { some: 'result' };
}
