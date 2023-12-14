'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('./routers');


const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

    server.route(routes);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
