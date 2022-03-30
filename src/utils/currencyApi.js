const cache = new Map();

export const dateFormat_CurrencyApi = 'YYYY-MM-DD';

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
    return convertFromPLN(amountPLN, currencyExchangeTo);
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