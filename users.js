class VisitorInteraction {
  constructor(type, element, timestamp) {
    this.type = type;
    this.element = element;
    this.timestamp = timestamp;
  }
}

class InteractionTracker {
  constructor() {
    this.interactions = [];
  }

  track(interaction) {
    if (interaction instanceof VisitorInteraction) {
      this.interactions.push(interaction);
      // Send interaction data to server (e.g., using AJAX)
      console.log('Interaction tracked:', interaction); // For demonstration
    } else {
      console.error('Invalid interaction object provided.');
    }
  }
}

const tracker = new InteractionTracker();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const clickableElements = node.querySelectorAll('a, button, input[type="submit"], input[type="button"]');

          clickableElements.forEach((element) => {
            if (!element.id) {
              element.id = `clickable-element-${Date.now()}`;
            }

            element.addEventListener('click', () => {
              trackInteraction('click', element.id);
            });
          });
        }
      });
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
