let valid_name = str => /^[A-ZА-ЯЁa-zа-яё]+$/.test(str),

    valid_date = str => /^\d{2}\.\d{2}\.\d{4}$/.test(str),

    valid_group = str => /^[A-ZА-ЯЁa-zа-яё]{2,4}-\d-(\d{2}|\d{4})$/.test(str),


    validate = data => {

        if (!valid_name(data.firstName)) {
            console.log('Неверное поле FIRST_NAME: ' + data.firstName);
            return false;
        }

        if (!valid_name(data.lastName)) {
            console.log('Неверное поле LAST_NAME: ' + data.lastName);
            return false;
        }

        if (!valid_date(data.birthDate)) {
            console.log('Неверное поле BIRTH_DATE: ' + data.birthDate);
            return false;
        }

        if (!valid_group(data.group)) {
            console.log('Неверное поле GROUP: ' + data.group);
            return false;
        }

        return true;
    };


module.exports = validate;