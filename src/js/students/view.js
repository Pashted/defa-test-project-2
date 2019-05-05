import * as Age from "./age";

let table = $('.table'),
    table_body = table.find('.table__body'),

    remove_btn = $('.button_action_remove');

/**
 * Добавление студента в конец таблицы
 * @param student {Object}
 */
let add = student => {

    let age = Age.get(student.birthDate) || 'Ошибка в дате рождения';

    table_body.append(`
        <div class="table__row" data-id="${student._id}">
            <div class="table__element table__element_width_small print-hide">
                <span><input class="checkbox" type="checkbox"></span>
            </div>
    
            <div class="table__element table__element_width_large" data-first-name="${student.firstName}">
                <span>${student.firstName}</span>
            </div>
    
            <div class="table__element table__element_width_large" data-last-name="${student.lastName}">
                <span>${student.lastName}</span>
            </div>
    
            <div class="table__element" data-birth-date="${student.birthDate}">
                <span>${age}</span>
            </div>
    
            <div class="table__element" data-group="${student.group}">
                <span>${student.group}</span>
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


    /**
     * Активация/деактивация кнопки удаления
     */
    let checked_elements = table_body.find('.table__row_active');

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

    remove_btn.addClass('button_disabled');
};


/**
 * Выбор всех строк
 */
let selectAll = () => {

    table_body.find('.table__row')
        .addClass('table__row_active')
        .find('.checkbox').prop('checked', true);

    remove_btn.removeClass('button_disabled');
};


export { add, select, selectAll, deselectAll };