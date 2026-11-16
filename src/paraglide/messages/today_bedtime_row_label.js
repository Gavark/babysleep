/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Bedtime_Row_LabelInputs */

const fr_today_bedtime_row_label = /** @type {(inputs: Today_Bedtime_Row_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coucher`)
};

const en_today_bedtime_row_label = /** @type {(inputs: Today_Bedtime_Row_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bedtime`)
};

/**
* | output |
* | --- |
* | "Bedtime" |
*
* @param {Today_Bedtime_Row_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_bedtime_row_label = /** @type {((inputs?: Today_Bedtime_Row_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Bedtime_Row_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_bedtime_row_label(inputs)
	return fr_today_bedtime_row_label(inputs)
});