/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ start: NonNullable<unknown>, end: NonNullable<unknown> }} Today_Row_RangeInputs */

const fr_today_row_range = /** @type {(inputs: Today_Row_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.start} – ${i?.end}`)
};

const en_today_row_range = /** @type {(inputs: Today_Row_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.start} – ${i?.end}`)
};

/**
* | output |
* | --- |
* | "{start} – {end}" |
*
* @param {Today_Row_RangeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_row_range = /** @type {((inputs: Today_Row_RangeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Row_RangeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_row_range(inputs)
	return fr_today_row_range(inputs)
});