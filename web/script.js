class ParallaxLayer {
  constructor(element) {
    this.element = element;
  }

  parallaxEffect(scrollY) {
    this.element.style.transform = `translateY(${scrollY * 0.5}px)`;
  }
}

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
    this.parallaxLayers = document.querySelectorAll('.parallax-layer');
  }

  init() {
    this.trackPageView();
    this.trackButtonClicks();
    this.initParallax();
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

  initParallax() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      this.parallaxLayers.forEach(layer => {
        new ParallaxLayer(layer).parallaxEffect(scrollY);
      });
    });
  }
}

const page = new Page();
window.onload = () => page.init();
