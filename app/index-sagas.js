import { call, put, takeLatest } from 'redux-saga/effects';

import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE } from './reducer';

const fetchJSON = (url, options = {}) =>
  new Promise((resolve, reject) => {
    return fetch(url, options)
      .then(response => (response.status !== 200) ? reject(response) : response)
      .then(response => response.json())
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
