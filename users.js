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
      this.saveToCSV(interaction);
      this.saveToJSON(this.interactions); // Save all interactions periodically
    } else {
      console.error('Invalid interaction object provided.');
    }
  }

  saveToCSV(interaction) {
    const csvData = `${interaction.type},${interaction.element},${interaction.timestamp}\n`;
    const hiddenElement = document.createElement('a');
    hiddenElement.href = URL.createObjectURL(new Blob([csvData], { type: 'text/csv' }));
    hiddenElement.download = `interaction-${Date.now()}.csv`;
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    document.body.removeChild(hiddenElement);
  }

  saveToJSON(interactions) {
    const jsonData = JSON.stringify(interactions, null, 2); // Pretty-printed JSON
    const hiddenElement = document.createElement('a');
    hiddenElement.href = URL.createObjectURL(new Blob([jsonData], { type: 'application/json' }));
    hiddenElement.download = `interactions-${Date.now()}.json`;
    document.body.appendChild(hiddenElement);
    hiddenElement.click();
    document.body.removeChild(hiddenElement);
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
