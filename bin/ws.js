const WebSocket = require('ws'),
    WebSocketServer = WebSocket.Server,
    db = require('../model/file-storage'),
    is_valid = require('../helpers/validate');


/**
 * Создание websocket-сервера поверх http-сервера
 * @param server
 * @param port
 * @returns {Promise<void>}
 */
let init = async (server, port) => {
    let socket = new WebSocketServer({ server, port });

    await db.init();

    /**
     * Рассылка всем участникам
     * @param data
     */
    socket.broadcast = function broadcast(data) {

        socket.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN)
                client.send(JSON.stringify(data));

        });

    };

    socket.on('connection', async ws => {

        console.log('<< НОВОЕ СОЕДИНЕНИЕ');

        // создание строки из объекта перед отправкой
        let send = data => ws.send(JSON.stringify(data));

        /**
         * Обработка входящих запросов
         */
        ws.on('message', async query => {

            let request = JSON.parse(query),
                response = {
                    event: request.method
                };

            console.log('<< ЗАПРОС:', request);


            try {
                switch (request.method) {

                    case 'getAllStudents':
                        response.content = await db.get();
                        response.status = 'OK';

                        break;

                    case 'saveStudent':

                        /**
                         * Такая же валидация есть на стороне клиента, но для надежности нужно проверить на сервере тоже
                         */
                        let errors = is_valid(request.data);

                        if (!errors.length) {
                            let save_result = await db.save(request.data);

                            response.status = save_result.status;
                            response.content = save_result.content;

                        } else {
                            response.status = 'invalid';
                            response.content = errors;
                        }

                        break;


                    case 'removeStudents':
                        let remove_result = await db.remove(request.data);

                        response.status = remove_result.status;
                        response.content = remove_result.content;

                        break;

                    default:

                        response.status = 'empty response';

                }

            } catch (err) {
                response.content = err.message;
                response.status = 'error';

            }

            if (response.status === 'success') {
                socket.broadcast(response);
                console.log('>> МАССОВАЯ РАССЫЛКА:', response);

            } else {
                send(response);
                console.log('>> ПРОСТОЙ ОТВЕТ', response);
            }

        });


        ws.on('close', () => console.log('-- ПОЛЬЗОВАТЕЛЬ ОТКЛЮЧИЛСЯ'));
    });

};


module.exports = init;