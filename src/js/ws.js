let ws, events = {};


/**
 * Подключение к вебсокету для фонового получения данных
 * @returns {Promise<any> | Promise}
 */
let connect = () => {

    ws = new WebSocket(`ws://${window.location.hostname}:8081/`);
    ws.onerror = reconnect;


    return new Promise(resolve => ws.onopen = () => {

        /**
         * Добавление на новое соединение обработчиков ответов от сервера
         */
        console.log('events', events);

        $.each(events, (name, obj) => {
            ws.addEventListener(name, obj.callback, false);
        });


        ws.onclose = reconnect;

        ws.onmessage = event => {

            if (!event.data)
                return false;

            let data = JSON.parse(event.data);

            if (data.event) {
                // Вызов на клиенте сохраненного ранее события с передачей ему данных с сервера
                events[data.event].Event.data = data;

                ws.dispatchEvent(events[data.event].Event);
            }

            console.log('WS: Новое сообщение', data);
        };


        console.log('WS: Соединение установлено');

        resolve();
    });
};


/**
 * Переподключение при отключении от сервера
 */
let reconnect = () => {
    console.log('Соединение разоварно. Переподключение через 1 сек.');

    setTimeout(connect, 1000);
};


/**
 * Подписка из других модулей на события сервера
 * Уровень реализации на данный момент простой - на 1 тип событий можно подписаться лишь 1 раз.
 * @param event {string}
 * @param callback {function}
 */
let on = (event, callback) => {

    /**
     * События сохраняются в массив на случай переподключения к серверу.
     * На новое соединение эти обработчики нужно вешать заново - этим занимается функция connect.
     */

    if (!events.hasOwnProperty(event))
        events[event] = {
            Event: new CustomEvent(event),
            callback
        };
};


/**
 * Отправка сообщения на сервер
 * @param data
 */
let send = data => ws.send(JSON.stringify(data)); // формирование строки из объекта перед отправкой


export { connect, on, send };