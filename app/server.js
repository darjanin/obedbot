'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runServer = runServer;

var _client = require('@slack/client');

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _resources = require('./resources');

var _routes = require('./routes');

var _orders = require('./orders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Starts the bot server
 */
function runServer() {
  (0, _routes.startExpress)();
  const rtm = _resources.slack.rtm;

  rtm.start();
  console.log('slack server started');

  rtm.on(_client.RTM_EVENTS.MESSAGE, _orders.messageReceived);

  rtm.on(_client.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
    // the timeout is here to go around a bug where connection is opened, but not properly established
    console.log('Connected');

    setTimeout(_orders.loadTodayOrders, 3000);
  });

  // set up last calls for each restaurant
  let lastCallSchedule = {
    jedloPodNos: _nodeSchedule2.default.scheduleJob('30 9 * * *', () => {
      (0, _orders.makeLastCall)('jedlo pod nos');
    }),
    veglife: _nodeSchedule2.default.scheduleJob('50 9 * * *', () => {
      (0, _orders.makeLastCall)('veglife');
    }),
    spaghetti: _nodeSchedule2.default.scheduleJob('50 10 * * *', () => {
      (0, _orders.makeLastCall)('spaghetti');
    })
  };

  let resetSchedule = _nodeSchedule2.default.scheduleJob('0 12 * * *', _orders.dropOrders);
}
//# sourceMappingURL=server.js.map