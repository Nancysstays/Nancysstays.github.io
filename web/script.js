class AnalyticsTracker {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  trackEvent(eventName) {
    const data = {
      event: eventName,
      ip_address: this.getIPAddress(),
      timestamp: new Date().toISOString()
    };

    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      console.log('Event tracked successfully.');
    })
    .catch(error => {
      console.error('Error tracking event:', error);
    });
  }

  getIPAddress() {
    return '127.0.0.1'; // Placeholder, replace with actual IP address
  }
}

class Page {
  constructor() {
    this.tracker = new AnalyticsTracker('https://your-analytics-endpoint.com/track');
  }

  init() {
    this.trackPageView();
    this.trackButtonClicks();
  }

  trackPageView() {
    this.tracker.trackEvent('page_view');
  }

  trackButtonClicks() {
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.tracker.trackEvent('button_click');
      });
    });
  }
}

const page = new Page();
window.onload = () => page.init();
