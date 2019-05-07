import '../less/template.less';

/**
 * Добавление функционала для старых браузеров
 */
import './custom-event-polyfill';
import 'promise-polyfill/src/polyfill';

import './students/index';
import './checkbox';
import { deselectAll } from "./students/view";


/**
 * Печать страницы
 */
$('.button_action_print').click(() => {

    $('.print-date').text('Дата создания страницы: ' + new Date().toString());

    deselectAll();
    window.print();
});
