import * as ws from "../ws";
import * as Modal from "../modal";

import * as View from "./view";
import './filter';
import './sort';

import * as Validate from '../validate';
import * as Notify from '../notify';
import { serializeJSON as toJSON } from '../serializeJSON';


let page = $('.page'),
    table = page.find('.table');

/**
 * Получение списка всех студентов
 */
ws.connect()
    .then(() => ws.send({ method: 'getAllStudents' }));


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

                View.deselectAll();
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
     * Отправка формы из модального окна
     */
    .on({
        save: (event) => {

            let form = $('.form');

            ws.send({
                method: 'saveStudent',
                data:   toJSON(form.serializeArray())
            });
        }
    }, '.modal')


    /**
     * Клик по кнопке "Удалить"
     */
    .on({
        click: function () {

            if ($(this).hasClass('button_disabled'))
                return false;

            let data = [];

            // Формирование списка записей для удаления
            $.each(
                table.find('.table__row_active'),
                (i, elem) =>
                    data.push({ _id: $(elem).data('id') })
            );

            ws.send({
                method: 'removeStudents', data
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
            if (table.find('.table__body .table__row:not(.table__row_active)').length)
                View.selectAll();
            else
                View.deselectAll();

            return false;
        }

        // Del
        else if (e.which === 46) {
            $('.button_action_remove').click();
        }

    }
});


/**
 * Обработчик ответа сервера со списком всех студентов
 */
ws.on('getAllStudents', event => {
    console.log(event);
    if (event.data.content)
        event.data.content.forEach(elem => {
            View.add(elem); // добавить студента в конец таблицы
        });

    else
        Notify.show('Ошибка на сервере', 'error');

});


/**
 * Обработчик ответа сервера с результатом сохранения
 */
ws.on('saveStudent', event => {

    if (event.data.status === 'success') {
        Notify.show(`Добавлена новая запись<br>
            ${event.data.content.firstName} ${event.data.content.lastName}`, 'success');

    } else if (event.data.status === 'failed') {
        Notify.show(event.data.content, 'error');

    }
});


/**
 * Обработчик ответа сервера с результатом удаления
 */
ws.on('removeStudents', event => {
    console.log(event.data);
    Notify.show('Удаление завершено');

});
