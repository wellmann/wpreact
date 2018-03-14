'use strict';

// Dependencies
import fs from 'fs';
import express from 'express';
import http from 'http';
import { httpsRedirect, expressPhp, wordpressSubdir } from './middleware';
import spdy from 'spdy';
import shrinkRay from 'shrink-ray';
import preact from 'preact';
import renderToString from 'preact-render-to-string';
import Helmet from 'preact-helmet';
import AppHandlerDefault from '../shared/AppHandler';
import assets from '../public/assets.json';

// Constants
const { h } = preact,
  { default: AppHandler } = AppHandlerDefault,
  port = process.env.PORT || 3000,
  server = express();

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Express server
server
  .disable('x-powered-by')
  .use(httpsRedirect())
  .use(shrinkRay())
  .use(express.static('public', { maxAge: 31557600 }))
  .use(wordpressSubdir, expressPhp())
  .get(/^\/(admin|login|wp-admin|wp-login)\/?/, (req, res) => res.redirect('/wp/wp-admin/'))
  .set('views', './server')
  .get('*', (req, res) => {
    const app = renderToString(h(AppHandler, { url: req.url })),
      head = Helmet.rewind(),
      title = head.title.toString();

    res.render('index.pug', Object.assign({title, app}, assets));
  });

// HTTP 1.1 Server
http
  .createServer(server)
  .listen(8080);

// HTTP(S) 2 Server
spdy
  .createServer({
    key: fs.readFileSync('./server/ssl/server.key'),
    cert: fs.readFileSync('./server/ssl/server.crt')
  }, server)
  .listen(port, () => console.log(`App listening on port ${port}!`));