/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Rating_Medium_TitleInputs */

const fr_history_rating_medium_title = /** @type {(inputs: History_Rating_Medium_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nuit moyenne`)
};

const en_history_rating_medium_title = /** @type {(inputs: History_Rating_Medium_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average night`)
};

/**
* | output |
* | --- |
* | "Average night" |
*
* @param {History_Rating_Medium_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_rating_medium_title = /** @type {((inputs?: History_Rating_Medium_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Rating_Medium_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_rating_medium_title(inputs)
	return en_history_rating_medium_title(inputs)
});