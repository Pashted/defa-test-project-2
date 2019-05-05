let table = $('.table');


table
    .on({
        click: function () {
            let $this = $(this);

            $this.removeClass('filter_disabled')
                .addClass('filter_enabled');

        }
    }, '.filter_disabled')


    .on({
        click: function () {
            let $this = $(this);

            $this.removeClass('filter_enabled')
                .addClass('filter_disabled');

        }
    }, '.filter_enabled');