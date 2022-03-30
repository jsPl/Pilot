const cache = new Map();

export const fetchCurrencyExchangeRateToPLN = (currencyCode = 'eur', dateYYYMMDD = 'last') => {
    if (currencyCode.toLowerCase() === 'pln') {
        return { date: dateYYYMMDD, rate: 1, currencyCode }
    }

    const cacheKey = `${currencyCode}-${dateYYYMMDD}`;
    if (cache.has(cacheKey)) {
        //console.log('returns', cacheKey, 'from cache')
        return cache.get(cacheKey)
    }

    // console.log('returns', cacheKey, 'from api')
    return fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/${dateYYYMMDD}/?format=json`)
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
            return { date: dateYYYMMDD, rate: 1, currencyCode }
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