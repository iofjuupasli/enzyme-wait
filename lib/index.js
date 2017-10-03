'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWaitForElement = undefined;

var _assertionError = require('assertion-error');

var _assertionError2 = _interopRequireDefault(_assertionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DISPLAY_NAME = 'waitForElement';

const createWaitForElement = exports.createWaitForElement = function (selector) {
  let maxTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
  let interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  return rootComponent => {

    // Check correct usage
    if (!selector) {
      return Promise.reject(new _assertionError2.default(`No selector specified in ${DISPLAY_NAME}.`));
    }

    if (!rootComponent) {
      return Promise.reject(new _assertionError2.default(`No root component specified in ${DISPLAY_NAME}.`));
    }

    if (!rootComponent.length) {
      return Promise.reject(new _assertionError2.default(`Specified root component in ${DISPLAY_NAME} not found.`));
    }

    // Race component search against maxTime
    return new Promise((resolve, reject) => {

      let remainingTime = maxTime;

      const intervalId = setInterval(() => {
        if (remainingTime < 0) {
          clearInterval(intervalId);
          return reject(new _assertionError2.default(`Expected to find ${selector} within ${maxTime}ms, but it was never found.`));
        }

        const targetComponent = rootComponent.update().find(selector);
        if (targetComponent.length) {
          clearInterval(intervalId);
          return resolve(rootComponent);
        }

        remainingTime = remainingTime - interval;
      }, interval);
    });
  };
};