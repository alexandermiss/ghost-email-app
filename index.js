const path = require('path');
const p = path.resolve(__dirname, '../../../');

const common = require(p + '/core/server/lib/common');
const susListeners = require(__dirname + '/listeners');

module.exports = {
    activate(ghost) {
      common.events.on('post.published', susListeners.published);
      common.events.on('post.published.edited', susListeners.publishedUpdated);
    }
};
