'use strict';

// Dependencies
import dotenv from 'dotenv';
import path from 'path';
import epf from 'express-php-fpm';

// Local dependencies
import pkg from '../../package.json';

// Constants
const env = process.env.NODE_ENV,
    { parsed: parsedDotenv } = dotenv.config({ path: './server/.env' }),
    { wordpressSubdir } = pkg.config,
    phpEnv = {
        'WP_DEBUG_DISPLAY': (env != 'production'),
        'WP_DEBUG_LOG': (env == 'production'),
        'WP_SUBDIR': wordpressSubdir,
        'HTTPS': 'on'
    },
    epfOptions = {
        documentRoot: path.join(path.resolve('./server'), wordpressSubdir),
        env: { ...parsedDotenv, ...phpEnv },
        socketOptions: { port: 9000 },
    };

export default () => epf(epfOptions);
export { wordpressSubdir };