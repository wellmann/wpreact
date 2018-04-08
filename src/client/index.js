'use strict';

// Dependencies
import { h, render } from 'preact';

// Local dependencies
import AppHandler from '../shared/AppHandler';

// Constants
const doc = document;

render(<AppHandler />, doc.body, doc.getElementById('app'));