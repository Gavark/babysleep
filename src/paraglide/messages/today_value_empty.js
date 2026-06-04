/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Value_EmptyInputs */

const fr_today_value_empty = /** @type {(inputs: Today_Value_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`—`)
};

const en_today_value_empty = /** @type {(inputs: Today_Value_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`—`)
};

/**
* | output |
* | --- |
* | "—" |
*
* @param {Today_Value_EmptyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_value_empty = /** @type {((inputs?: Today_Value_EmptyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Value_EmptyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_value_empty(inputs)
	return en_today_value_empty(inputs)
});