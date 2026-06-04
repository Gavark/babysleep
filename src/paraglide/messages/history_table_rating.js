/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Table_RatingInputs */

const fr_history_table_rating = /** @type {(inputs: History_Table_RatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note`)
};

const en_history_table_rating = /** @type {(inputs: History_Table_RatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rating`)
};

/**
* | output |
* | --- |
* | "Rating" |
*
* @param {History_Table_RatingInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_table_rating = /** @type {((inputs?: History_Table_RatingInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Table_RatingInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_table_rating(inputs)
	return en_history_table_rating(inputs)
});