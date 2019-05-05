/**
 * Валидация вводимых данных на стороне клиента
 */

import Inputmask from "inputmask";


let form = $('.form'),
    group_mask = /[A-ZА-ЯЁa-zа-яё]{2,4}-\d-(\d{2}|\d{4})/,
    date_mask,
    name_mask;


/**
 * Ввод Имени и фамилии
 */
Inputmask({
    regex:       '[A-ZА-ЯЁa-zа-яё]+',
    casing:      'title',
    placeholder: ""
}).mask(form.find('[name="firstName"], [name="lastName"] '));


/**
 * Ввод даты
 */
Inputmask({
    alias:       'datetime',
    inputFormat: "dd.mm.yyyy",
    placeholder: "ДД.ММ.ГГГГ"
}).mask(form.find('[name="birthDate"]'));


/**
 * Ввод имени группы
 */
Inputmask({
    regex:           "[A-ZА-ЯЁa-zа-яё]{2,4}-\\d-(\\d{2}|\\d{4})",
    casing:          "upper",
    onKeyValidation: function (key, result) {
        console.log(key, result);
    }
}).mask(form.find('[name="group"]'));

let name = () => {

};

let date = () => {

};

let group = () => {
};

export { name, date, group }