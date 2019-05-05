let valid_name = str => /^[A-ZА-ЯЁa-zа-яё]+$/.test(str),

    valid_date = str => {

        let valid_syntax = /^\d{2}\.\d{2}\.\d{4}$/.test(str);

        if (!valid_syntax)
            return false;

        let now = new Date(),

            then = str.split('.');
        then = new Date(then[2], then[1] - 1, then[0]);

        // если дата далека от ближайшей, человека не существует
        return then.getFullYear() > 1850 && (now - then) > 0;

    },

    valid_group = str => /^[A-ZА-ЯЁa-zа-яё]{2,4}-\d-(\d{2}|\d{4})$/.test(str),


    validate = data => {

        let invalid_fields = [];

        if (!valid_name(data.firstName)) {
            console.log('Неверное поле FIRST_NAME: ' + data.firstName);
            invalid_fields.push('firstName');
        }

        if (!valid_name(data.lastName)) {
            console.log('Неверное поле LAST_NAME: ' + data.lastName);
            invalid_fields.push('lastName');
        }

        if (!valid_date(data.birthDate)) {
            console.log('Неверное поле BIRTH_DATE: ' + data.birthDate);
            invalid_fields.push('birthDate');
        }

        if (!valid_group(data.group)) {
            console.log('Неверное поле GROUP: ' + data.group);
            invalid_fields.push('group');
        }

        return invalid_fields;
    };


module.exports = validate;