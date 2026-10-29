const DEFAULT_ENDPOINT = '/api/v1/events';

class AnalyticsTracker {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.queue = [];
    this.flushPromise = null;
    this.distinctId = crypto.randomUUID();
  }

  track(eventName, properties = {}) {
    if (typeof eventName !== 'string' || eventName.length === 0) {
      throw new TypeError('Analytics event name must be a non-empty string');
    }

    this.queue.push({
      event_id: crypto.randomUUID(),
      distinct_id: this.distinctId,
      event_name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
    });
  }

  getQueue() {
    return this.queue.map((event) => ({ ...event, properties: { ...event.properties } }));
  }

  flush() {
    if (this.flushPromise) {
      return this.flushPromise.then(() => this.flush());
    }

    if (this.queue.length === 0) {
      return Promise.resolve();
    }

    const batch = this.queue.splice(0);
    this.flushPromise = fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Analytics request failed with status ${response.status}`);
        }
      })
      .catch((error) => {
        this.queue = [...batch, ...this.queue];
        throw error;
      })
      .finally(() => {
        this.flushPromise = null;
      });

    return this.flushPromise;
  }
}

export function initializeAnalytics({ endpoint = DEFAULT_ENDPOINT } = {}) {
  const tracker = new AnalyticsTracker(endpoint);
  window.Analytics = tracker;
  return tracker;
}

export const trackEvent = (eventName, properties = {}) => {
  if (window.Analytics) {
    window.Analytics.track(eventName, properties);
  }
};

export const trackPage = (title, path) => {
  trackEvent('page_view', { title, path });
};
