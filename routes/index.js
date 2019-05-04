const express = require('express'),
    router = express.Router(),
    ips = require('../bin/ips');

/* GET home page. */
router.get('/', async (req, res, next) => {

    res.render('students', {
        title:   'Учёт студентов',
        server_address: ips[0] + ':3000'
    });
});

module.exports = router;
