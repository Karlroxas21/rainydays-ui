/**
 * Transforms a snake_case to Title Case.
 * Sample: 'this_kind_of_values' to 'This Kind Of Values'
 */
export const snakeToTitleCase = (val: string) => {
    if (!val) return;

    return val
        .split('_')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};
