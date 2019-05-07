import { refresh_even_status } from "./view";

let search_field = $('.form_type_search .form__input_type_text'),
    table_body = $('.table__body');

/**
 * Регистронезависимый поиск
 */
$.extend($.expr[":"], {
    "containsNC": function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});


search_field.on({
    input: function () {
        let searched_text = $(this).val(), // искомая фраза

            rows = table_body.find('.table__row'), // все строки таблицы

            cells = table_body.find(`[data-${search_field.data('search-target')}]`); // ячейки, в которых следует искать совпадение


        let found = cells.find(`:containsNC(${searched_text})`);  // ячейки, в которые входит искомая фраза

        // подсвечивание результатов
        found.html(function () {
            return $(this).text()
                .replace(new RegExp(`(${searched_text})`, 'g'), '<span class="table__highlight">$1</span>')
        });

        cells.find('.table__highlight:empty').remove();

        rows
            .removeClass('filter-row_search') //  // сброс статуса фильтра этого типа
            .not(found.closest('.table__row')).addClass('filter-row_search'); // фильтрация


        refresh_even_status();
    }

});