import * as Sort from '../sort';
import * as Age from '../age';

let table_body = $('.table__body');

/**
 * Создает список уникальных значений из колонки
 * @param col
 * @param name
 */
let get_unique_list = (col, name) => {

    let result = [], history = [];

    col.forEach(value => {

        let val = name === 'birth-date'
                  ? Age.get(value) // нас интересуют возрасты, а не даты рождения - используем их для фильтрации
                  : value;

        if ($.inArray(val, history) >= 0)
            return;

        history.push(val);

        result.push(val);

    });

    return result;
};


/**
 * Создает объект выпадающего меню для фильтра
 * @returns {*|jQuery}
 */
let get_filter_menu = (filter_name, inactive_values) => {

    /**
     * Создание нового меню с опциями для фильтра
     */
    let menu = $(
        `<div class="filter-menu" data-name="${filter_name}">
                    <h3 class="title title_size_h3 filter-menu__title">Фильтр</h3>
                    <div class="filter-menu__content"></div>
                    <div class="filter-menu__footer"><button type="button" class="button filter-menu__save-button">Применить</button></div>
                </div>`
        ),


        sorted = Sort.get_sorted_col(filter_name),// Массив отсортированных неуникальных значений из колонки

        list = get_unique_list(sorted, filter_name); // Массив уникальных значений


    if (!inactive_values.hasOwnProperty(filter_name))
        inactive_values[filter_name] = []; // чтобы при первом создании списка не было undefined


    let checkbox_list = list.map(value =>
            $(`<div class="checkbox__group">
                <input type="checkbox" class="checkbox filter-menu__checkbox" value="${value}"
                    ${$.inArray(value, inactive_values[filter_name]) < 0 ? 'checked' : ''}>
                <label class="checkbox__label">${value}</label>
            </div>`)
        );


    /**
     * Выделить все
     */
    let select_all = $(`<input type="checkbox" class="checkbox" value="select_all">`);

    // если нет деактивированных элементов в фильтре
    if (!inactive_values[filter_name].length)
        select_all.prop('checked', true);

    // если деактивированы не все
    else if (inactive_values[filter_name].length < checkbox_list.length)
        select_all.prop('indeterminate', true);

    select_all = select_all
        .wrap("<div class='checkbox__group'></div>").parent()
        .append('<label class="checkbox__label">(Выделить все)</label>');


    menu.find('.filter-menu__content').append(select_all, checkbox_list);

    return menu;
};

export { get_filter_menu as get }