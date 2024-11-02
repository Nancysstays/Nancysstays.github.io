// cdn-injector.js

function injectCDN(cdnLinks) {
  const head = document.getElementsByTagName('head')[0];

  cdnLinks.forEach(link => {
    const script = document.createElement('script');
    script.src = link;
    script.async = true; // Optional: Load asynchronously
    head.appendChild(script);
  });
}

// Example usage:
const cdnLinks = [
  "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
];

injectCDN(cdnLinks);
