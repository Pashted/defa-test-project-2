import * as Menu from './menu';
import { refresh_even_status } from '../view';

/**
 * На случай, если в процессе работы таблица изменится, фильтр строит список уникальных значений при каждом показе.
 * В следующем объекте сохраняются предыдущие результаты выбора.
 * Поскольку все новые значения по умолчанию считаются активными,
 * мы сохраняем лишь деактивированные и удаляем их отсюда при активации и последующем нажатии "Применить".
 */
let inactive_values = {};


let page = $('.page'),
    win = $(window),
    table_body = page.find('.table__body');


/**
 * Показ меню с опциями фильтра
 */
page
    .on({
        click: function () {

            let btn = $(this);

            // Повторный клик по кнопке скроет меню
            if (btn.hasClass('filter_open')) {
                page.trigger('click');
                return false;
            }


            btn.addClass('filter_open');

            /**
             * Создание меню фильтра
             */
            let filter_menu = Menu.get(btn.data('filter'), inactive_values);


            /**
             * Позиционирование меню относительно кнопки вызова
             */
            let resize_event = {
                resize() {
                    filter_menu.css({
                        right: (window.innerWidth - btn.offset().left - btn.width() - 13) + 'px',
                        top:   (btn.offset().top + btn.height() + 22) + 'px',
                    })
                }
            };
            win.on(resize_event);

            // немедленное применение координат
            resize_event.resize();


            /**
             * Скрытие опций фильтра по клику за пределами меню
             */
            let hide_event = {
                click(event) {
                    if (!$(event.target).closest('.filter-menu').length) {

                        filter_menu.remove();

                        page.off(hide_event);
                        win.off(resize_event);

                        btn.removeClass('filter_open');
                    }
                }
            };
            page.on(hide_event);


            filter_menu.appendTo(page);

        }


    }, '.filter')


    /**
     * Применение фильтра с заданными настройками
     */
    .on({
        click: function () {

            let $this = $(this),
                filter = $this.closest('.filter-menu'),
                filter_name = filter.data('name');


            /**
             * Сохранение деактивированных элементов
             */
            let result = [];

            $.each(filter.find('.filter-menu__checkbox:not(:checked)'),
                (i, elem) =>
                    result.push($(elem).val())
            );

            inactive_values[filter_name] = result;


            /**
             * Переключение стиля кнопки в шапке таблицы
             */
            let btn = page.find('.filter_open');

            if (inactive_values[filter_name].length)
                btn.removeClass('filter_disabled')
                    .addClass('filter_enabled');

            else
                btn.removeClass('filter_enabled')
                    .addClass('filter_disabled');
            // строки, ранее скрытые этим фильтром [data-filter*="${filter_name}"]


            // Скрытие/показ строк


            // все ячейки этой колонки
            let cells = table_body.find(`[data-${filter_name}]`);

            // сбрасываем для содержащих их строк состояние фильтра
            cells.parent().removeClass(`filter-row_${filter_name}`);


            // получаем строки, которые необходимо скрыть
            let filter_rows = cells.map((i, elem) => {

                if ($.inArray($(elem).text().trim(), inactive_values[filter_name]) >= 0)
                    return elem;

            }).parent();

            filter_rows
                .addClass(`filter-row_${filter_name}`);

            refresh_even_status();

            page.trigger('click'); // скрытие меню
        }

    }, '.filter-menu__save-button');

