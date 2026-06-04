/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ time: NonNullable<unknown> }} Today_Ideal_Bedtime_SubInputs */

const fr_today_ideal_bedtime_sub = /** @type {(inputs: Today_Ideal_Bedtime_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Pour réveil souhaité ${i?.time}`)
};

const en_today_ideal_bedtime_sub = /** @type {(inputs: Today_Ideal_Bedtime_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`For desired wake-up ${i?.time}`)
};

/**
* | output |
* | --- |
* | "For desired wake-up {time}" |
*
* @param {Today_Ideal_Bedtime_SubInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_ideal_bedtime_sub = /** @type {((inputs: Today_Ideal_Bedtime_SubInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Ideal_Bedtime_SubInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_ideal_bedtime_sub(inputs)
	return en_today_ideal_bedtime_sub(inputs)
});