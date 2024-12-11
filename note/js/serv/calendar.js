// calendar.js

class CalendarApp {
  static #apiKey = 'YOUR_API_KEY';
  static #clientId = 'YOUR_CLIENT_ID';

  constructor() {
    this._events = [];
  }

  static async init() {
    gapi.client.init({
      apiKey: CalendarApp.#apiKey,
      clientId: CalendarApp.#clientId,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      scope: 'https://www.googleapis.com/auth/calendar'
    });
  }

  #handleError(error) {
    console.error('API Error:', error);
    // Add more robust error handling, e.g., display an error message to the user
  }

  async #authenticate(apiCall) {
    try {
      await gapi.auth2.getAuthInstance().signIn();
      return await apiCall();
    } catch (error) {
      this.#handleError(error);
    }
  }

  async createEvent(event) {
    return this.#authenticate(async () => {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });
      this._events.push(response.result);
      this.#saveEventsToLocalStorage();
      return response.result;
    });
  }

  async getEvent(eventId) {
    return this.#authenticate(async () => {
      const response = await gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId
      });
      return response.result;
    });
  }

  async updateEvent(eventId, updatedEvent) {
    return this.#authenticate(async () => {
      const response = await gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: updatedEvent
      });
      this._events = this._events.map(event =>
        event.id === eventId ? response.result : event
      );
      this.#saveEventsToLocalStorage();
      return response.result;
    });
  }

  async deleteEvent(eventId) {
    return this.#authenticate(async () => {
      await gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
      this._events = this._events.filter(event => event.id !== eventId);
      this.#saveEventsToLocalStorage();
      return true;
    });
  }

  #saveEventsToLocalStorage() {
    localStorage.setItem('calendarEvents', JSON.stringify(this._events));
  }

  #loadEventsFromLocalStorage() {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      this._events = JSON.parse(storedEvents);
    }
  }

  async listUpcomingEvents() {
    return this.#authenticate(async () => {
      const response = await gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      });
      this._events = response.result.items;
      this.#saveEventsToLocalStorage();
      return this._events;
    });
  }

  getEvents() {
    this.#loadEventsFromLocalStorage();
    return this._events;
  }
}

// ... (rest of the code for handleAuthClick, initClient, loadEvents, and form submission) ... 

// Function to handle the authorization click
function handleAuthClick() {
    // Include the Google API Client Library
    gapi.load('client:auth2', initClient);
}

async function initClient() {
    await CalendarApp.init();
    gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: 'https://www.googleapis.com/auth/calendar'
    }).then(function () {
        gapi.auth2.getAuthInstance().signIn().then(loadEvents);
    });
}

// Function to load events from the calendar
function loadEvents() {
  const app = new CalendarApp();
  app.listUpcomingEvents().then(events => {
      const eventList = document.getElementById('event-list');
      eventList.innerHTML = ''; // Clear previous events

      if (events.length > 0) {
          events.forEach(event => {
              const eventItem = document.createElement('li');
              eventItem.classList.add('event-item');
              eventItem.innerHTML = `<strong>${event.summary}</strong> - ${event.start.dateTime || event.start.date}`;
              eventList.appendChild(eventItem);
          });
      } else {
          const noEventsItem = document.createElement('li');
          noEventsItem.textContent = 'No upcoming events found.';
          eventList.appendChild(noEventsItem);
      }
  });
}

// Handle form submission for creating new events
const newEventForm = document.getElementById('new-event-form');
newEventForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const app = new CalendarApp();
    const summary = document.getElementById('event-summary').value;
    const start = document.getElementById('event-start').value;
    const end = document.getElementById('event-end').value;

    const newEvent = {
        summary: summary,
        start: { dateTime: start },
        end: { dateTime: end }
    };

    app.createEvent(newEvent).then(() => {
        loadEvents(); // Reload events after creating
        newEventForm.reset(); // Clear the form
    });
});
