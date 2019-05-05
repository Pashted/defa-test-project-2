let page = $('.page'),
    modal = page.find('.modal');

/**
 * Показ модального окна
 * @param title
 * @param data
 */
let open = (title, data) => {
    page.addClass('page_scroll_disabled');

    // Заполнение формы новыми значениями
    if (data)
        $.each(data, (input, value) => {
            modal.find(`[name="${input}"]`)
                .removeClass('form__input_invalid')
                .val(value);
        });

    modal
        .addClass('modal_open')
        .find('.title').text(title);

    modal.find('.form__input').eq(0).focus();
};


/**
 * Удаление невалидного состояния у инпутов при изменении
 */
modal.find('.form__input').on({
    input: function () {
        $(this).removeClass('form__input_invalid');
    }
});


/**
 * Скрытие модального окна
 */
let closeModal = () => {
    page.removeClass('page_scroll_disabled');
    modal.removeClass('modal_open');
};

modal.find('.modal__close-button').click(closeModal);

/**
 * Скрытие по Esc
 */
$(document).on({
    keyup(e) {
        if (e.which === 27) {
            if (!modal.hasClass('modal_open'))
                return;

            let focused_inputs = false;

            $.each(modal.find('input'), (i, elem) => {
                let $this = $(elem);

                if ($this.is(':focus')) { // Если хотя бы одно поле находится в фокусе

                    $this.blur(); // снимаем фокус с этого поля

                    focused_inputs = true; // отменяем закрытие окна
                    return false;
                }
            });

            if (!focused_inputs)
                closeModal();
        }
    },

});


/**
 * Скрытие модального окна по клику на темной области
 */
modal.on({
    mousedown(e) {
        if ($(e.target).is(modal))
            closeModal();
    }
});

/**
 * Сохранение формы в модальном окне.
 * Вызывает событие, на которое подписываются другие модули
 */

modal.find('.modal__save-button').click(() => modal.trigger('save'));


export { open, closeModal as close, modal as window };