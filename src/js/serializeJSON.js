/**
 * Создаёт объект из сериализованного массива
 * @param data {array}
 * @returns {Object}
 */
let serializeJSON = function (data) {
    let result = {};

    data.forEach(obj => {

        // Парсинг целого числа
        if (/^\d+$/.test(obj.value))
            obj.value = parseInt(obj.value);

        switch (typeof result[obj.name]) {
            // Если одно значение с таким же именем уже существует
            case 'string':


                result[obj.name] = [result[obj.name], obj.value];
                break;

            // Если два и более значения с таким же именем уже существуют
            case 'object':
                result[obj.name].push(obj.value);
                break;

            // Если значений с таким же именем еще нет
            default:
                result[obj.name] = obj.value;
        }

    });

    return result;
};

export { serializeJSON };