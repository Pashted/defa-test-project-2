import '../less/template.less';

/**
 * Добавление функционала для старых браузеров
 */
import './custom-event-polyfill';
import 'promise-polyfill/src/polyfill';

import './students/index';
import { deselectAll } from "./students/view";


$('.button_action_print').click(() => {
    deselectAll();
    window.print();
});
