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



    add = row => {

    },

    edit = row => {

    },

    remove = row => {

    };



module.exports = { init, get, add, edit, remove };