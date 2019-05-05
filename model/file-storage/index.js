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


    save = async (row) => {

        let data = await get();


        if (!row._id) {
            // Добавление новой записи

            // первая запись
            if (!data.length)
                row._id = 1;

            // инкремент наибольшего id
            else
                row._id = Math.max.apply(Math, data.map(obj => obj._id)) + 1;

            data.push(row);

        } else {

            let index = data.findIndex(arr => arr._id === row._id);

            console.log('index', index);

            if (index < 0) {
                return null; // Такой записи не существует

            } else {
                // Изменение существующей записи

                data[index] = row;
            }
        }


        await set(data);

        return row;

    },


    remove = async (rows) => {

        let data = await get();

        // Список записей от клиента для удаления
        for (let i = 0; i < rows.length; i++) {

            if (!rows[i]._id)
                return null; // Удалять нечего

            // индекс удаляемого элемента в базе
            let index = data.findIndex(arr => arr._id === rows[i]._id) < 0;

            if (index < 0)
                return null; // Такой записи не существует

            data.splice(index, 1);

        }

        await set(data);

        return rows;
    };


module.exports = { init, get, save, remove };