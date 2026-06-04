/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Day_Invalid_DateInputs */

const fr_day_invalid_date = /** @type {(inputs: Day_Invalid_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date invalide`)
};

const en_day_invalid_date = /** @type {(inputs: Day_Invalid_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invalid date`)
};

/**
* | output |
* | --- |
* | "Invalid date" |
*
* @param {Day_Invalid_DateInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const day_invalid_date = /** @type {((inputs?: Day_Invalid_DateInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Day_Invalid_DateInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_day_invalid_date(inputs)
	return en_day_invalid_date(inputs)
});