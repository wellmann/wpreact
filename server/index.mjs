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
  server = express(),
  indexHtml = fs.readFileSync('./server/index.html', 'utf8');

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Express server
//
// * Redirects http requests to https
// * Enables GZIP compression
// * Registers public assets directory
// * Redirects wp-admin to proper subdirectory
// * Serves request through preact-router
server
  .disable('x-powered-by')
  .use(httpsRedirect())
  .use(shrinkRay())
  .use(express.static('public', { maxAge: 31557600 }))
  .use(wordpressSubdir, expressPhp())
  .get(/^\/(admin|login|wp-admin|wp-login)\/?/, (req, res) => res.redirect('/wp/wp-admin/'))
  .get('*', (req, res) => {
    const appHtml = renderToString(h(AppHandler, { url: req.url })),
      head = Helmet.rewind();

    // Inserts rendered app
    let serverHtml = indexHtml.replace('<!-- ::APP:: -->', appHtml);

    // Updates head meta tgas
    const helmetAttr = / data-preact-helmet/g,
      docTitle = head.title.toString().replace(helmetAttr, ''),
      metaTags = head.meta.toString().replace(helmetAttr, '');

    serverHtml = serverHtml.replace('<html>', `<html ${head.htmlAttributes.toString()}>`);
    serverHtml = serverHtml.replace('<!-- ::TITLE:: -->', docTitle);
    serverHtml = serverHtml.replace('<!-- ::META:: -->', metaTags);

    // Updates assets paths with version hashes
    Object.keys(assets).forEach(function (key) {
      serverHtml = serverHtml.replace(key, assets[key]);
    });

    res.send(serverHtml);
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