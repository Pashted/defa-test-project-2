let page = $('.page'),
    area = $(`<div class="notification-area"></div>`).appendTo(page);

/**
 * Выводит в области уведомлений сообщение
 * @param text
 * @param type
 */
let show = (text, type) => {

    let note = $(`
            <div class="notification notification_type_${type || 'info'}">
                <div class="notification__text">${text}</div>
                <div class="notification__progress"></div>
            </div>
        `),

        progress = note.find('.notification__progress'),

        hide_note = () => {
            note.fadeOut(200);
            setTimeout(() => note.remove(), 200);
        };

    note.on({
        click: hide_note,

        mouseleave() {
            progress.animate(
                { width: 0 },
                5000,
                'linear',
                hide_note
            );
        },

        mouseenter() {
            progress
                .stop(true, false)
                .css('width', '100%');
        }
    });

    note.appendTo(area)
        .trigger('mouseleave');

};


export { show };