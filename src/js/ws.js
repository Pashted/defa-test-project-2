let ws = new WebSocket(`ws://${window.location.hostname}:8081/`),

    connect = new Promise(resolve => ws.onopen = () => {

        console.log('WS: Соединение установлено');

        ws.onmessage = event => {

            if (!event.data)
                return false;


            let data = JSON.parse(event.data);

            if (data.event) {
                // Вызов события на клиенте с передачей ему данных с сервера
                events[data.event].data = data.content;
                ws.dispatchEvent(events[data.event]);
            }

            console.log('WS: Новое сообщение', data);
        };

        resolve();
    });


/**
 * Подписка из других модулей на события сервера
 */
let events = {},
    on = (event, callback) => {

        if (!events.hasOwnProperty(event))
            events[event] = new CustomEvent(event);

        ws.addEventListener(event, callback, false);
    };


/**
 * Отправка сообщения на сервер
 * @param data
 */
let send = data => ws.send(JSON.stringify(data));


export { connect, on, send };