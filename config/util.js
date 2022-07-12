module.exports.escapeRegExpChars = (text) => text.toString().replace(/[-[\]{}()*+?.İ,\\^$|#\s]/g, '\\$&');
module.exports.sort = function(query) {
    const result = {};

    if (query) {
        const [ field, order ] = query.split(' ');
        if (field && order) {
            const direction = order === 'ASC' ? 1 : -1;
            result[field] = direction;
        }
    }

    return result;
};
