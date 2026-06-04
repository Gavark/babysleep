/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Rating_Good_TitleInputs */

const fr_history_rating_good_title = /** @type {(inputs: History_Rating_Good_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bonne nuit`)
};

const en_history_rating_good_title = /** @type {(inputs: History_Rating_Good_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Good night`)
};

/**
* | output |
* | --- |
* | "Good night" |
*
* @param {History_Rating_Good_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_rating_good_title = /** @type {((inputs?: History_Rating_Good_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Rating_Good_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_rating_good_title(inputs)
	return en_history_rating_good_title(inputs)
});