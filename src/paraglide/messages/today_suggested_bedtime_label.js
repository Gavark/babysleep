/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Suggested_Bedtime_LabelInputs */

const fr_today_suggested_bedtime_label = /** @type {(inputs: Today_Suggested_Bedtime_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coucher suggéré`)
};

const en_today_suggested_bedtime_label = /** @type {(inputs: Today_Suggested_Bedtime_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suggested bedtime`)
};

/**
* | output |
* | --- |
* | "Suggested bedtime" |
*
* @param {Today_Suggested_Bedtime_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_suggested_bedtime_label = /** @type {((inputs?: Today_Suggested_Bedtime_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Suggested_Bedtime_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_suggested_bedtime_label(inputs)
	return en_today_suggested_bedtime_label(inputs)
});