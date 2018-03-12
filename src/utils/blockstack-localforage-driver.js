/* eslint-disable no-use-extend-native/no-use-extend-native */

import {getFile, putFile, deleteFile, isUserSignedIn} from 'blockstack';

const execCallback = (promise, cb) => {
  if (cb) {
    promise.then(res => cb(null, res), err => cb(err));
  }
};
const file = v => `${v}.json`;

export default {
  _keyList: new Set(),
  _driver: 'blockstack',
  _initStorage() {
    if (isUserSignedIn()) {
      return Promise.resolve();
    }

    return Promise.reject();
  },
  getItem(key, cb) {
    this._keyList.add(key);

    const p = getFile(file(key))
      .then(data => data)
      .catch(() => undefined);

    execCallback(p, cb);
    return p;
  },
  removeItem(key, cb) {
    this._keyList.delete(key);

    const p = deleteFile(file(key));

    execCallback(p, cb);
    return p;
  },
  setItem(key, value, cb) {
    this._keyList.add(key);

    const p = putFile(file(key), value);

    execCallback(p, cb);
    return p;
  },
  clear(cb) {
    const p = Promise.all(
      [...this._keyList].map(key => this.removeItem(key))
    );

    execCallback(p, cb);
    return p;
  },
  key(n, cb) {
    const p = Promise.resolve([...this._keyList][n]);

    execCallback(p, cb);
    return p;
  },
  keys(cb) {
    const p = Promise.resolve([...this._keyList]);

    execCallback(p, cb);
    return p;
  },
  length(cb) {
    const p = Promise.resolve(this._keyList.size);

    execCallback(p, cb);
    return p;
  }
};
