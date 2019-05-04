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

    let ts = new Date(date);

    if (ts.toString() === 'Invalid Date')
        return null;

    let years = new Date().getFullYear() - ts.getFullYear();

    if (years < 0)
        return null;

    let words = ['год', 'года', 'лет'];

    return `${years} ${words[_decline(years)]}`;
};


export { getAge as get };