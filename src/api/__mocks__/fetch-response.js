// Mock for fetch-response.js to avoid import.meta issues

const fetchAPI = jest.fn().mockResolvedValue({
  data: {
    message: 'Mock data',
    success: true
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
  request: {}
});

const fetchAPIProgress = jest.fn().mockResolvedValue({
  data: {
    message: 'Mock data with progress',
    success: true
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
  request: {}
});

export { fetchAPI, fetchAPIProgress };
