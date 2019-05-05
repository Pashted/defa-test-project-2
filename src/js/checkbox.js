$('.page').on({

    click: function () {

        let $this = $(this),
            checkbox = $this.find('.checkbox'),
            is_checked = checkbox.is(':checked'),

            menu = $this.closest('.filter-menu__content');

        /**
         * Имитация поведения чекбоксов фильтра Excel
         */

        let all_chkb = menu.find('.checkbox'), // все чекбоксы в этом меню
            main_checkbox = all_chkb.filter('[value="all"]'), // "Выделить все"
            other_chkb = all_chkb.filter(':not([value="all"])'), // все, кроме "Выделить все"
            other_checked_chkb = all_chkb.filter(':checked:not([value="all"])'); // все выбранные, кроме "Выделить все"


        if (checkbox.val() === 'all') {
            /**
             * Если нажали "Выделить все"
             */

            main_checkbox.prop('indeterminate', false);

            // Если выделены не все - true (выбираем все), иначе false (снимаем выделение со всех)
            $.each(all_chkb, (i, elem) =>
                $(elem).prop('checked', other_checked_chkb.length < other_chkb.length));


        } else {
            /**
             * Если нажали простой чекбокс
             */

            if (!is_checked) {
                // если нажали тот, который не выбран и сейчас он станет выбранным

                // если это последний невыбранный
                if (other_chkb.length - other_checked_chkb.length === 1) {
                    main_checkbox.prop('indeterminate', false).prop('checked', true);

                } else {
                    main_checkbox.prop('checked', false).prop('indeterminate', true);
                }

            } else {
                // если нажали тот, который выбран и сейчас он станет невыбранным

                // остался последний выбранный
                if (other_chkb.length - other_checked_chkb.length === other_chkb.length - 1) {

                    main_checkbox.prop('checked', false).prop('indeterminate', false);

                } else {
                    main_checkbox.prop('checked', false).prop('indeterminate', true);
                }

            }

            checkbox.prop('checked', !is_checked); // инвертирует выбор
        }

    }

}, '.checkbox__group');