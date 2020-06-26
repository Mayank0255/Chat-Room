const moment = require('moment');

function formatMessage(message, user) {
    return {
        user,
        message,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;