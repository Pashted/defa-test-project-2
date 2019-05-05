/**
 * Склонение фразы в паре с числительным.
 * Например: 21 год, 23 года, 35 лет
 */
let _decline = num => {
    let cases = [2, 0, 1, 1, 1, 2];
    return (num % 100 > 4 && num % 100 < 20) ? 2 : cases[Math.min(num % 10, 5)];
};


/**
 * Формирование строки с возрастом на текущий момент из даты рождения
 * @param date
 * @returns {string|null}
 */
let getAge = date => {

    let date_arr = date.split('.');

    if (date_arr.length !== 3)
        return null;

    let year = new Date(date_arr[2], date_arr[1] - 1, date_arr[0]).getFullYear();


    let years = new Date().getFullYear() - year;

    if (years < 0)
        return null;

    let words = ['год', 'года', 'лет'];

    return `${years} ${words[_decline(years)]}`;
};


export { getAge as get };