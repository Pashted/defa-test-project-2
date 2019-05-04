import * as ws from "../ws";
import * as Modal from "../modal";

import * as View from "./view";
import './filter';
import './sort';


let page = $('.page'),
    table = page.find('.table');

/**
 * Получение списка всех студентов
 */
ws.connect
    .then(() => ws.send({ method: 'getAllStudents' }));


/**
 * Обработчик ответа сервера со списком всех студентов
 */
ws.on('getAllStudents', event => {

    event.data.forEach(elem => {
        View.add(elem); // добавить студента в конец таблицы
    });
});


/**
 * Обработчик ответа сервера с результатом сохранения
 */
ws.on('saveStudent', event => {
    console.log(event.data);
});


/**
 * Обработчик ответа сервера с результатом удаления
 */
ws.on('removeStudent', event => {
    console.log(event.data);

});


/**
 * Клик по строке
 */
page
    .on({
        mousedown: function (e) {
            let target_is_button = $(e.target).hasClass('button');

            if (e.which === 1 && !target_is_button)
                View.select($(this));
        },

        dblclick(e) {
            if (e.which === 1) {
                let $this = $(this);

                View.select($this, true);

                $this.find('.button_action_edit').click();
            }
        }
    }, '.table__row[data-id]')


    /**
     * Клик по чекбоксу
     */
    .on({
        click: () => false
    }, '.table__row[data-id] .checkbox')


    /**
     * Клик по кнопке "Изменить"
     */
    .on({
        click: function () {
            let row = $(this).parentsUntil('.table').filter('.table__row');

            Modal.open('Изменение информации о студенте', {
                _id:       row.data('id'),
                firstName: row.find('[data-first-name]').data('first-name'),
                lastName:  row.find('[data-last-name]').data('last-name'),
                birthDate: row.find('[data-birth-date]').data('birth-date'),
                group:     row.find('[data-group]').data('group')
            });
        }
    }, '.table .button_action_edit')


    /**
     * Клик по кнопке "Добавить"
     */
    .on({
        click() {
            Modal.open('Добавление нового студента', {
                _id:       null,
                firstName: '',
                lastName:  '',
                birthDate: '',
                group:     ''
            });
        }
    }, '.button_action_add')


    /**
     * Клик по кнопке "Удалить"
     */
    .on({
        click: function () {

            if ($(this).hasClass('button_disabled'))
                return false;

            $.each(table.find('.table__row_active'), (i, elem) => {

                ws.send({
                    method: 'removeStudent',
                    data:   {
                        _id: $(elem).data('id')
                    }
                });
            });
        }
    }, '.button_action_remove');


/**
 * Управление с клавиатуры
 */
$(document).on({
    keydown(e) {
        // Esc
        if (e.which === 27 && !$('.modal').hasClass('modal_open')) {
            View.deselectAll();
        }

        // Ctrl + A
        else if (e.which === 65 && e.ctrlKey) {
            View.selectAll();
            return false;
        }

        // Del
        else if (e.which === 46) {
            $('.button_action_remove').click();
        }


        // console.log(e.which);
    }
});


let add = () => {

    console.log('add');

// ws.send({
//     method: 'saveStudent',
//     data:   {
//         "_id":        1,
//         "firstName":  "Игорь",
//         "lastName":   "Петров",
//         "birthDate": "1.5.2003",
//         "group":      "ТМ-35-17"
//     }
// })

};


let remove = id => {

    console.log('remove');
};
