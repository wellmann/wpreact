'use strict';

export default () => (req, res, next) => {
    if (!req.secure) {
        res.redirect('https://' + req.headers.host + req.url);

        return;
      }
      
      next();
}