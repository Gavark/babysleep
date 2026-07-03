/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Clear_FieldInputs */

const fr_today_clear_field = /** @type {(inputs: Today_Clear_FieldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Effacer`)
};

const en_today_clear_field = /** @type {(inputs: Today_Clear_FieldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear`)
};

/**
* | output |
* | --- |
* | "Clear" |
*
* @param {Today_Clear_FieldInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_clear_field = /** @type {((inputs?: Today_Clear_FieldInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Clear_FieldInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_clear_field(inputs)
	return en_today_clear_field(inputs)
});