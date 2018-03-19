'use strict';

// Dependencies
import preact from 'preact';
import renderToString from 'preact-render-to-string';
import AppHandlerDefault from '../../shared/AppHandler';
import Helmet from 'preact-helmet';
import assets from '../../public/assets.json';

// Contstants
const { h } = preact,
    { default: AppHandler } = AppHandlerDefault;

export default () => (req, res) => {
    const app = renderToString(h(AppHandler, { url: req.url })),
        head = Helmet.rewind(),
        title = head.title.toString();

    res.render('index.pug', { title, app, ...assets });
}