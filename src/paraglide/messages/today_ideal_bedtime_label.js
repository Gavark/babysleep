/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Ideal_Bedtime_LabelInputs */

const fr_today_ideal_bedtime_label = /** @type {(inputs: Today_Ideal_Bedtime_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coucher idéal`)
};

const en_today_ideal_bedtime_label = /** @type {(inputs: Today_Ideal_Bedtime_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ideal bedtime`)
};

/**
* | output |
* | --- |
* | "Ideal bedtime" |
*
* @param {Today_Ideal_Bedtime_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_ideal_bedtime_label = /** @type {((inputs?: Today_Ideal_Bedtime_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Ideal_Bedtime_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_ideal_bedtime_label(inputs)
	return en_today_ideal_bedtime_label(inputs)
});