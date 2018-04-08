'use strict';

// Dependencies
import { h, Component } from 'preact';
import Router from 'preact-router';

// Local dependencies
import Home from './Home';
import Page from './Page';
import Blog from './Blog';
import Error from './Error';

export default ({ url }) => {
    
    return (
        <Router url={url}>
            <Home path="/" />
            <Page path="/:slug" />
            <Blog path="/blog/:slug" />
            <Error type="404" default />
        </Router>
    );
}