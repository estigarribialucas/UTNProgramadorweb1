var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    res.render('tienda/shop', {
        layout: 'tienda/layout'
    });
});


module.exports = router;