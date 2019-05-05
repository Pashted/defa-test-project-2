/**
 * Валидация вводимых данных на стороне клиента
 */

import Inputmask from "inputmask";

let form = $('.form');


/**
 * Ввод Имени и фамилии
 */
Inputmask({
    regex:           '[A-ZА-ЯЁa-zа-яё]+',
    casing:          'title',
    placeholder:     '',
    showMaskOnHover: false,
    showMaskOnFocus: false,
    insertMode:      false
}).mask(form.find('[name="firstName"], [name="lastName"] '));


/**
 * Ввод даты
 */
Inputmask({
    alias:       'datetime',
    inputFormat: "dd.mm.yyyy",
    placeholder: "ДД.ММ.ГГГГ",
    insertMode:  false
}).mask(form.find('[name="birthDate"]'));


/**
 * Ввод имени группы
 */
let group_field = form.find('[name="group"]');

Inputmask({
    regex:      "[A-ZА-ЯЁa-zа-яё]{2,4}-\\d-\\d{2,4}",
    casing:     "upper",
    insertMode: false
}).mask(group_field);


