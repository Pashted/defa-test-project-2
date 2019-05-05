let table = $('.table'),
    table_body = table.find('.table__body'),


    /**
     * Все строки таблицы
     * @returns {jQuery}
     */
    get_rows = () => table_body.children('[data-id]'),


    /**
     * Меняет местами два элемента, если первый больше второго
     * @param a
     * @param b
     * @returns {number}
     */
    bubble_sort = (a, b) => a - b,
    bubble_sort_inverse = (a, b) => -(a - b),


    /**
     * Формирует сортированнй числовой массив со значениями из колонки
     * @param name
     * @returns {array}
     */
    sort_col = name => {

        let col;

        if (name === 'birth-date') {

            col = get_date_column(name).sort(bubble_sort_inverse);

            // собираем дату обратно в формат дд.мм.гггг
            col = $.map(col, date => {
                let arr = [
                    date.getDate(),
                    date.getMonth() + 1,
                    date.getFullYear(),
                ];

                // не хватает ведущих нулей
                if (arr[0] < 10)
                    arr[0] = '0' + arr[0];

                if (arr[1] < 10)
                    arr[1] = '0' + arr[1];

                return arr.join('.');
            })

        } else if (name === 'id') {
            col = get_id_column().sort(bubble_sort);

        } else {
            col = get_column(name).sort();

        }

        return col;
    },


    /**
     * Раскидывание строк таблицы (только в начало DESC или только в конец ASC) на основе отсортированного числового массива
     * @param col
     * @param direction
     */
    sort_rows = (col, direction) => {


        let name = col ? col.data('sort') : 'id',

            sorted_col = sort_col(name);


        console.log('SORT', name, ['ASC', 'DESC', 'ASC(default)'][direction]);

        let rows = get_rows();

        $.map(sorted_col, val => { // перебираем сортированные строки
            let row;

            if (direction === 2)
                row = rows.filter(`[data-id="${val}"]`);
            else
                row = rows.children(`[data-${name}="${val}"]`).parent(); // берем совпадения по атрибуту


            // перемещаем их в конец таблицы
            if (direction === 0 || direction === 2)
                row.detach().appendTo(table_body);

            // перемещаем их в начало таблицы
            else if (direction === 1)
                row.detach().prependTo(table_body);

            row.addClass('sorted' + direction);
        })
    },


    /**
     * Получение текстовых значений из колонки
     * @param name
     * @returns {*|jQuery}
     */
    get_column = name => // тело функции

        $.map(get_rows(), elem => // цикл на объекте из строк

            $(elem).children(`[data-${name}]`).data(name) // сохранение значения ячейки из целевой колонки
        ),


    /**
     * Получение id строк
     * @returns {*|jQuery}
     */
    get_id_column = () =>

        $.map(get_rows(), elem =>

            $(elem).data('id') // сохранение id строки для сортировки по умолчанию
        ),


    /**
     * Получение объектов с датами из колонки
     * @param name
     * @returns {*|jQuery}
     */
    get_date_column = name =>

        $.map(get_rows(), elem => {
            let date_arr = $(elem).children(`[data-${name}]`).data(name).split('.'); // массив из дня, месяца и года

            return date_arr.length === 3
                   ? new Date(date_arr[2], date_arr[1] - 1, date_arr[0]) // дата рождения - timestamp
                   : 0;
        });


/**
 * Сортировка по заданному направлению
 */
$.each(table.find('.sort'), (i, elem) => {

    let $this = $(elem),
        count = 0;

    // Переключатель классов на кнопках сортировки
    $this.click(() => {
        let direction = count++ % 3,
            asc = direction === 0,
            desc = direction === 1,
            def = direction === 2;

        $this
            .toggleClass('sort_direction_asc', asc)
            .toggleClass('sort_direction_desc', desc)
            .toggleClass('sort_direction_default', def);


        if (asc || desc) {
            sort_rows($this, direction);

        } else {

            let sortable = table.find('.sort:not(.sort_direction_default)');

            // если мы снимаем сортировку с текущей колонки, в соседних она все еще может быть активирована
            if (sortable.length) {

                // берем "первую попавшуюся" колонку (правильнее брать предыдущую примененную)
                // и сортируем таблицу по возрастанию ASC или по убыванию DESC

                sort_rows(sortable.eq(0), sortable.eq(0).hasClass('sort_direction_asc') ? 0 : 1);


            } else {
                // сортируем по id по возрастанию

                sort_rows(null, 2);
            }

        }


    });

});
