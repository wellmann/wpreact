'use strict';

// Dependencies
import preact from 'preact';
import renderToVdom from 'preact-render-to-vdom';

// Local dependencies
import AppHandlerDefault from '../../shared/AppHandler';
import assets from '../../public/assets.json';

// Contstants
const { h } = preact,
    { createRenderer } = renderToVdom,
    { default: AppHandler } = AppHandlerDefault;

export default () => (req, res) => {
    const renderer = createRenderer();

    renderer.render(h(AppHandler, { url: req.url }));

    setTimeout(() => {
        res.render('index.pug', { app: renderer.toHtml(), ...assets });
        //renderer.tearDown();
    }, 1000);
}