import * as Age from "./age";

let table = $('.table'),
    table_body = table.find('.table__body'),

    remove_btn = $('.button_action_remove');

/**
 * Формирование строки с информацией о студенте
 * @param data
 * @returns {HTMLElement}
 */
let get_row = data => {

    let age = Age.get(data.birthDate) || 'Ошибка в дате рождения';

    return $(`
        <div class="table__row" data-id="${data._id}">
            <div class="table__element table__element_width_small print-hide">
                <span><input class="checkbox" type="checkbox"></span>
            </div>
    
            <div class="table__element table__element_width_large" data-first-name="${data.firstName}">
                <span>${data.firstName}</span>
            </div>
    
            <div class="table__element table__element_width_large" data-last-name="${data.lastName}">
                <span>${data.lastName}</span>
            </div>
    
            <div class="table__element" data-birth-date="${data.birthDate}">
                <span>${age}</span>
            </div>
    
            <div class="table__element" data-group="${data.group}">
                <span>${data.group}</span>
            </div>
    
            <div class="table__element print-hide">
                <button class="button button_action_edit button_size_small" type="button">Изменить</button>
            </div>
        </div>
    `);

};

/**
 * Выбор строки
 * @param row
 * @param force_select {boolean}
 */
let select = (row, force_select) => {

    let checkbox = row.find('.checkbox');

    if (!row.hasClass('table__row_active') || force_select) {
        // Выделить
        row.addClass('table__row_active');
        checkbox.prop('checked', true);

    } else {
        // Снять выделение
        row.removeClass('table__row_active');
        checkbox.prop('checked', false);
    }

    refresh_remove_button();
};


/**
 * Активация/деактивация кнопки удаления
 */
let refresh_remove_button = () => {

    let checked_elements = table_body.find('.table__row_active:visible');

    if (checked_elements.length)
        remove_btn.removeClass('button_disabled');
    else
        remove_btn.addClass('button_disabled');

};


/**
 * Снятие выбора со всех строк
 */
let deselectAll = () => {

    table_body.find('.table__row_active')
        .removeClass('table__row_active')
        .find('.checkbox').prop('checked', false);

    refresh_remove_button();
};


/**
 * Выбор всех строк
 */
let selectAll = () => {

    table_body.find('.table__row:visible')
        .addClass('table__row_active')
        .find('.checkbox').prop('checked', true);

    refresh_remove_button();
};


/**
 * Добавление записи в конец таблицы
 */
let add = data => {

    get_row(data).appendTo(table_body);

    refresh_even_status();
};


/**
 * Обновление записи в таблице
 */
let update = (row, data) => {

    get_row(data).insertAfter(row);
    row.remove();

    refresh_even_status();
};


/**
 * Удаление записи из таблицы
 */
let remove = id => {

    table_body.find(`.table__row[data-id="${id}"]`).remove();

    refresh_remove_button();

    refresh_even_status();
};


/**
 * Снятие выделения со скрытых строк
 */
let deselect_invisible = () => {

    table_body.find(`.table__row_active:not(:visible)`)
        .removeClass('table__row_active')
        .find('.checkbox').prop('checked', false);
};

/**
 * Чередование строк
 */
let refresh_even_status = () => {

    table_body.find(`.table__row:visible`)
        .removeClass('table__row_even')
        .filter(':even')
        .addClass('table__row_even');

    deselect_invisible();
    refresh_remove_button();
};


export {
    select,
    selectAll,
    deselectAll,
    add, update,
    remove,
    refresh_even_status
};
