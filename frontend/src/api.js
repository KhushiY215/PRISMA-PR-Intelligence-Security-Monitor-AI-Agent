const BASE_URL = 'http://127.0.0.1:8000';

async function apiFetch(path, options = {}) {

  const res = await fetch(
    `${BASE_URL}${path}`,
    options
  );

  if (!res.ok) {
    throw new Error(
      `API error ${res.status}: ${res.statusText}`
    );
  }

  return res.json();
}

export const api = {

  getAnalytics: () =>
    apiFetch('/analytics'),

  getReviews: (params = {}) => {

    const q = new URLSearchParams();

    if (params.severity)
      q.set('severity', params.severity);

    if (params.repo)
      q.set('repo', params.repo);

    if (params.limit)
      q.set('limit', params.limit);

    const qs = q.toString();

    return apiFetch(
      `/reviews${qs ? '?' + qs : ''}`
    );
  },

  triggerWebhook: (payload) =>

    apiFetch('/webhook/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    }),
};