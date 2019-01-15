const path = require('path');
const p = path.resolve(__dirname, '../../../');

const utilsService = require(__dirname + '/utils');
const mailService = require(p + '/core/server/services/mail');
const urlService = require(p + '/core/server/services/url');
const pipeline = require(p + '/core/server/lib/promise/pipeline');
const models = require(p + '/core/server/models');

const Promise = require('bluebird');

const listener = function (post, action){
  const postUrl = urlService.getUrlByResourceId(post.id, {absolute: true})
  const postTitle = post.title;
  const mailMessage = action === 'new' ? 'Un nuevo post ha sido creado!' : 'Hay una actualización del post!';
  const mailSubject = action === 'new' ? 'Un nuevo post ha sido creado!' : 'Hay una actualización de un post!';
  const data = {postUrl: postUrl, postTitle: postTitle, mailMessage: mailMessage};

  utilsService.generateContent({template: 'mail', data: data})
    .then((content) => {
      models.Subscriber.fetchAll().then(function(col){
        const mails = col.pluck('email');
        if (mails.length > 0 ) mailer = new mailService.GhostMailer();

        return Promise.all(mails.map((m) => {
          const message = {
            to: m,
            subject: mailSubject,
            html: content.html,
            text: content.text
          };
          return mailer.send(message);
        }));

      });
    });
}


const published = function (post, options) {
  listener(post.toJSON(), 'new');
}

const publishedUpdated = function (post, options) {
  listener(post.toJSON(), 'edited');
}

module.exports = {
  published: published,
  publishedUpdated: publishedUpdated
};
