let ws, events = {};

let connect = () => {

    ws = new WebSocket(`ws://${window.location.hostname}:8081/`);
    ws.onerror = reconnect;


    return new Promise(resolve => ws.onopen = () => {

        /**
         * Добавление обработчиков ответов от сервера на новое соединение
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
 * Подписка из других модулей на события сервера
 * @param event {string}
 * @param callback {function}
 */
let on = (event, callback) => {

    /**
     * События сохраняются в массив на случай переподключения к серверу.
     * На новое соединение эти обработчики вешаются снова.
     */

    if (!events.hasOwnProperty(event))
        events[event] = {
            Event: new CustomEvent(event),
            callback
        };
};


/**
 * Переподключение при отключении от сервера
 */
let reconnect = () => {
    console.log('Соединение разоварно. Переподключение через 2 сек.');

    setTimeout(connect, 2000);
};


/**
 * Отправка сообщения на сервер
 * @param data
 */
let send = data => ws.send(JSON.stringify(data));


export { connect, on, send };