const _ = require('lodash').runInContext();
const fs = require('fs-extra');
const htmlToText = require('html-to-text');

const path = require('path');
const p = path.resolve(__dirname, '../../../');

const templatesDir = path.resolve(__dirname, 'templates');
const urlService = require(p + '/core/server/services/url');

const mailService = require(p + '/core/server/services/mail');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

exports.generateContent = function generateContent(options) {
    var defaults,
        data;

    defaults = {
        siteUrl: urlService.utils.urlFor('home', true)
    };

    data = _.defaults(defaults, options.data);

    return fs.readFile(path.join(templatesDir, options.template + '.html'), 'utf8')
        .then(function (content) {
            var compiled,
                htmlContent,
                textContent;

            compiled = _.template(content);
            htmlContent = compiled(data);

            textContent = htmlToText.fromString(htmlContent);

            return {
                html: htmlContent,
                text: textContent
            };
        });
};
