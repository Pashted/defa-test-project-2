const WebSocketServer = require('ws').Server,
    db = require('../model/file-storage');

/**
 * Создание websocket-сервера поверх http-сервера
 * @param server
 * @param port
 * @returns {Promise<void>}
 */
let init = async (server, port) => {
    let client = new WebSocketServer({ server, port });

    await db.init();

    client.on('connection', async ws => {

        console.log('USER CONNECTED');

        ws.on('message', async event => {
            let request = JSON.parse(event),
                response = {
                    event: request.method
                };

            console.log('ВХОДЯЩЕЕ СООБЩЕНИЕ:', request);


            try {
                switch (request.method) {

                    case'getAllStudents':
                        response.content = await db.get();

                        break;

                    case'editStudent':
                        response.content = { "EDIT_ID": true };

                        break;

                    case'addStudent':
                        response.content = { "ADD_ID": true };

                        break;

                    case'removeStudent':
                        response.content = { "REMOVE_ID": true };

                        break;

                    default:

                        response.status = 'empty response';

                }

            } catch (err) {
                response.content = err;
                response.status = 'error';

            }


            ws.send(JSON.stringify(response));

        });


        ws.on('close', () => console.log('USER DISCONNECTED'));
    });

};


module.exports = init;