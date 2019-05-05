const express = require('express'),
    router = express.Router(),
    ips = require('../helpers/ips');

/* GET home page. */
router.get('/', async (req, res, next) => {

    res.render('table', {
        title:          'Программа учёта студентов',
        server_address: ips[0] + ':3000'
    });
});

module.exports = router;
