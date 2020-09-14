function formatter(value, roundTo = 0, showZero = true, withoutSign = false) {
    if (value > 0) {
        if (withoutSign) {
            if (roundTo) {
                return Number.isInteger(+value) ? value : value.toFixed(roundTo);
            }

            return value;
        }

        if (roundTo) {
            return Number.isInteger(+value) ? `+${value}` : `+${value.toFixed(roundTo)}`;
        }

        return `+${value}`;
    }

    if (value === 0 && !showZero) {
        return '';
    }

    if(value === 0 && !withoutSign) {
        return '+0'
    }

    if (roundTo) {
        return Number.isInteger(+value) ? value : value.toFixed(roundTo);
    }

    return value;
}

export default formatter;
