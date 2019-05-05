'use strict';

const interfaces = require('os').networkInterfaces(),

    addresses = Object.keys(interfaces)
        .reduce((results, name) => results.concat(interfaces[name]), [])
        .filter((iface) => iface.family === 'IPv4' && !iface.internal)
        .map((iface) => iface.address);

module.exports = addresses;