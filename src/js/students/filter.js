import * as Sort from './sort';
import * as Age from './age';

let active_filters = {};


let page = $('.page'),
    table_body = page.find('.table .table__body');

/**
 * Создает список уникальных значений из колонки
 * @param col
 * @param name
 */
let get_unique_list = (col, name) => {

    let result = [], history = [];

    col.forEach(value => {

        let key = name === 'birth-date'
                  ? Age.get(value) // нас интересуют возрасты, а не даты рождения - используем их для фильтрации
                  : value;

        if ($.inArray(key, history) >= 0)
            return;

        history.push(key);
        result.push(key);

    });

    return result;
};


page
    .on({
        click: function () {
            let btn = $(this);

            if (btn.hasClass('filter_open')) {
                page.trigger('click');
                return false;
            }


            btn.addClass('filter_open');


            let filter_name = btn.data('filter'),
                sorted_col = Sort.get_sorted_col(filter_name), // Отсортированная колонка с повторяющимися значениями

                filter_list = get_unique_list(sorted_col, filter_name); // Массив уникальных значений

            let checkbox_list = filter_list.map((elem, i) =>
                `<div class="checkbox__group">
                    <input type="checkbox" class="checkbox filter-menu__checkbox" value="${elem}" checked>
                    <label class="checkbox__label">${elem}</label>
                </div>`);


            /**
             * Выделить все
             */
            checkbox_list.unshift(`<div class="checkbox__group">
                    <input type="checkbox" class="checkbox filter-menu__checkbox"  value="all" checked>
                    <label class="checkbox__label">(Выделить все)</label>
                </div>`);


            /**
             * Создание нового меню с фильтром
             * @type {*|jQuery}
             */
            let filter = $(`<div class="filter-menu">
                    <h3 class="title title_size_h3 filter-menu__title">Фильтр</h3>
                        <div class="filter-menu__content">${checkbox_list.join('')}</div>
                        <div class="filter-menu__footer"><button type="button" class="button filter-menu__save-button">Применить</button></div>
                    </div>`)
                .css({
                    right: (window.innerWidth - btn.offset().left - btn.width() - 13) + 'px',
                    top:   (btn.offset().top + btn.height() + 22) + 'px',
                })
                .appendTo(page);


            /**
             * Скрытие фильтра по клику за пределами меню
             * @param evt
             */
            let hide_event = {
                click(evt) {
                    if (!$(evt.target).closest('.filter-menu').length) {

                        filter.remove();
                        page.off(hide_event);
                        btn.removeClass('filter_open');
                    }
                }
            };
            page.on(hide_event);
        }

    }, '.filter_disabled')


    .on({
        click() {

        }

    }, '.filter-menu__save-button');