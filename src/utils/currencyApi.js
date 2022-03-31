import moment from 'moment';

const cache = new Map();

export const dateFormat_CurrencyApi = 'YYYY-MM-DD';
const dateFormat_TourExpense = 'DD.MM.YYYY';

export const fetchCurrencyExchangeRateToPLN = (currencyCode = 'eur', dateYYYYMMDD = 'last') => {
    if (currencyCode.toLowerCase() === 'pln') {
        return { date: dateYYYYMMDD, rate: 1, currencyCode }
    }

    const cacheKey = `${currencyCode}-${dateYYYYMMDD}`;
    if (cache.has(cacheKey)) {
        //console.log('returns', cacheKey, 'from cache')
        return cache.get(cacheKey)
    }

    // console.log('returns', cacheKey, 'from api')
    return fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/${dateYYYYMMDD}/?format=json`)
        .then(res => res.json())
        .then(data => {
            const exchangeData = {
                date: data?.rates[0].effectiveDate,
                rate: data?.rates[0].mid,
                currencyCode
            }
            cache.set(cacheKey, exchangeData)
            return exchangeData;
        })
        .catch(err => {
            return { date: dateYYYYMMDD, rate: 1, currencyCode }
        })
}

export const convertToPLN = (amount = 0, currencyExchangeFrom = {}) => {
    if (!currencyExchangeFrom.rate) {
        return null;
    }
    return roundCurrency(amount * currencyExchangeFrom.rate);
}

export const convertFromPLN = (amountPLN = 0, currencyExchangeTo = {}) => {
    if (currencyExchangeTo.currencyCode === 'PLN') {
        return amountPLN;
    }
    if (!currencyExchangeTo.rate) {
        return null;
    }
    return roundCurrency(amountPLN / currencyExchangeTo.rate);
}

export const convert = (amount = 0, currencyExchangeFrom = {}, currencyExchangeTo = {}) => {
    const amountPLN = convertToPLN(amount, currencyExchangeFrom);
    const amountForeign = convertFromPLN(amountPLN, currencyExchangeTo);

    // console.log('converting', amount, 
    //     currencyExchangeFrom.currencyCode, 'rates', currencyExchangeFrom,
    //     'to', currencyExchangeTo.currencyCode, 'rates', currencyExchangeTo, '=', amountForeign);

    return amountForeign;
}

const roundCurrency = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100

export const groupExpensesByCurrency = (expenses = []) => {
    if (expenses.length > 0) {
        return expenses.reduce((acc, { currency, price }) => {
            acc[currency] = (acc[currency] || 0) + price;
            return acc;
        }, {});
    }
    return {}
}

/**
 * 
 * @param {*} expenses array of expenses objects (required properties: date, currency, price)
 * @returns Object containing currencies grouped by date:
 * {
    "29.03.2022": {
        "PLN": 20,
        "EUR": 72.5,
        "USD": 70
    },
    "28.03.2022": {
        "PLN": 30
    }
}
 */
export const groupExpensesByDate = (expenses = []) => {
    if (expenses.length > 0) {
        const expensesByDate = expenses.reduce((acc, { date, currency, price }) => {
            const byDate = acc[date] || [];
            byDate.push({ currency, price })

            acc[date] = byDate;
            return acc;
        }, {});

        const expensesByDateAndCurrency = {};
        Object.keys(expensesByDate).forEach(date => {
            expensesByDateAndCurrency[date] = groupExpensesByCurrency(expensesByDate[date])
        })
        return expensesByDateAndCurrency;
    }
    return {}
}

export const fetchCurrencyExchangeRates = async (tourCurrency, expensesByDate) => {
    //console.log('fetchCurrencyExchangeRates expensesByDate', expensesByDate)

    const sumArrayValues = (a, b) => a + b;

    const result = Object.keys(expensesByDate).map(async date => {
        const dateInApiFormat = moment(date, dateFormat_TourExpense).format(dateFormat_CurrencyApi);
        const tourCurrencyExchangeData = await fetchCurrencyExchangeRateToPLN(tourCurrency, dateInApiFormat);

        //console.log('expensesByDate[' + dateInApiFormat + ']', expensesByDate[date])

        const expensesInTourCurrency = Object.keys(expensesByDate[date]).map(async currency => {
            const expenseCurrencyExchangeData = await fetchCurrencyExchangeRateToPLN(currency, dateInApiFormat);
            const amount = expensesByDate[date][currency];
            const amountInTourCurrency = convert(amount, expenseCurrencyExchangeData, tourCurrencyExchangeData);

            return amountInTourCurrency;
        })

        //console.log('expensesInTourCurrency', expensesInTourCurrency)

        return Promise.all(expensesInTourCurrency).then(amounts => amounts.reduce(sumArrayValues, 0));
    })
    //console.log('result', result)

    return Promise.all(result).then(amounts => amounts.reduce(sumArrayValues, 0));
}