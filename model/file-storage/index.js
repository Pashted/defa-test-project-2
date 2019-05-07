const fs = require('fs'),
    path = require('path'),

    storage = path.resolve(__dirname, './data.json');

let
    /**
     * Подготавливает файловое хранилище к работе
     * @returns {Promise<void>}
     */
    init = async () => {

        try {
            let exist = await check_existence();

            if (!exist) {
                set([])
                    .then(() => console.log('Хранилище создано'));

            } else {
                console.log('Хранилище найдено');
            }

        } catch (err) {
            throw err;
        }

    },


    /**
     * Проверяет наличие файлового хранилища
     * @returns {Promise<any>}
     */
    check_existence = () => new Promise(
        (resolve, reject) => fs.stat(storage, async (err, stats) => {

            if (err)
                if (err.code === 'ENOENT') // если файла нет
                    resolve(false);

                else // если другая ошибка
                    reject(err);


            else if (stats) // если файл существует
                resolve(true);

        })
    ),


    /**
     * Запись в файл
     * @param data {Object}
     * @returns {Promise<any>}
     */
    set = async (data) => {

        return new Promise(
            (resolve, reject) => fs.writeFile(
                storage,
                JSON.stringify(data, null, 4),
                err => {
                    if (err) reject(err);

                    resolve();
                })
        )
    },


    /**
     * Чтение из файла
     * @returns {Promise<any>}
     */
    get = () => {

        return new Promise(
            (resolve, reject) => fs.readFile(
                storage,
                { encoding: 'utf-8' },
                (err, data) => {
                    if (err) reject(err);

                    resolve(JSON.parse(data));
                })
        )
    },


    /**
     * Сохранение новой или существующей записи
     * @param row
     * @returns {Promise<{status: string}>}
     */
    save = async (row) => {

        let data = await get(),
        result= {
            status: 'success'
        };


        if (!row._id) {
            /**
             * Добавление новой записи
             */

            // первая запись
            if (!data.length)
                row._id = 1;

            // инкремент наибольшего id для последущих записей
            else
                row._id = Math.max.apply(Math, data.map(obj => obj._id)) + 1;

            data.push(row);

            // проверенные данные клиента с новым id
            result.content = row;


        } else {
            /**
             * Изменение существующей записи
             */

            let index = data.findIndex(arr => arr._id === row._id);

            result.content = row;

            if (index < 0) {
                // Такой записи не существует
                result.status = 'failed';

                return result;

            } else {

                data[index] = row;
            }
        }


        await set(data);

        return result;

    },


    /**
     * Удаление массива записей
     * @param rows
     * @returns {Promise<{content: Array, status: string}>}
     */
    remove = async (rows) => {

        let data = await get(),
            result = {
                status:  'success',
                content: []
            };

        // Список записей от клиента для удаления
        for (let i = 0; i < rows.length; i++) {


            if (!rows[i]._id) {
                // Неправильный запрос - удалять нечего
                result.status = 'failed';

                // затираем предыдущие результаты, так как они не будут удалены, но сохраняем текущий элемент для вывода ошибки
                result.content = [ rows[i] ];

                // отмена операции
                return result;
            }


            // индекс удаляемого элемента в базе
            let index = data.findIndex(arr => arr._id === rows[i]._id);

            if (index < 0) {
                // Такой записи не существует
                result.status = 'failed';

                // затираем предыдущие результаты, так как они не будут удалены, но сохраняем текущий элемент для вывода ошибки
                result.content = [ rows[i] ];

                // отмена операции
                return result;
            }

            // сохраняем текущий элемент для вывода сообщения
            result.content.push(data[index]);

            data.splice(index, 1);

        }

        await set(data);

        return result;
    };


module.exports = { init, get, save, remove };