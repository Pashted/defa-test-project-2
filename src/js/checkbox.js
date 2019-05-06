/**
 * Кастомные чекбоксы, имитирующие поведение чекбоксов фильтра Excel
 */

$('.page').on({

    click: function () {

        let $this = $(this),
            checkbox = $this.find('.checkbox'),
            is_checked = checkbox.is(':checked'),

            menu = $this.closest('.filter-menu__content');


        let all = menu.find('.checkbox'), // все чекбоксы в этом меню
            main = all.filter('[value="select_all"]'), // "Выделить все"
            others = all.filter(':not([value="select_all"])'), // все, кроме "Выделить все"
            others_checked = all.filter(':checked:not([value="select_all"])'); // все выбранные, кроме "Выделить все"


        if (checkbox.is(main)) {
            /**
             * Если нажали "Выделить все"
             */

            main.prop('indeterminate', false);

            // Если выделены не все - true (выбираем все), иначе false (снимаем выделение со всех)
            $.each(all, (i, elem) =>
                $(elem).prop('checked', others_checked.length < others.length));

            others.trigger('input');

        } else {
            /**
             * Если нажали простой чекбокс
             */

            if (!is_checked) {
                // если нажали тот, который не выбран и сейчас он станет выбранным

                // если это последний невыбранный
                if (others.length - others_checked.length === 1) {
                    main.prop('indeterminate', false).prop('checked', true);

                } else {
                    main.prop('checked', false).prop('indeterminate', true);
                }

            } else {
                // если нажали тот, который выбран и сейчас он станет невыбранным

                // остался последний выбранный
                if (others.length - others_checked.length === others.length - 1) {

                    main.prop('checked', false).prop('indeterminate', false);

                } else {
                    main.prop('checked', false).prop('indeterminate', true);
                }

            }

            checkbox
                .prop('checked', !is_checked) // инвертирует выбор
                .trigger('input');
        }

    }

}, '.checkbox__group');