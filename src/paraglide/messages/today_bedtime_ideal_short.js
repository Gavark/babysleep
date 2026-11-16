/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ time: NonNullable<unknown> }} Today_Bedtime_Ideal_ShortInputs */

const fr_today_bedtime_ideal_short = /** @type {(inputs: Today_Bedtime_Ideal_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`idéal ${i?.time}`)
};

const en_today_bedtime_ideal_short = /** @type {(inputs: Today_Bedtime_Ideal_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ideal ${i?.time}`)
};

/**
* | output |
* | --- |
* | "ideal {time}" |
*
* @param {Today_Bedtime_Ideal_ShortInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_bedtime_ideal_short = /** @type {((inputs: Today_Bedtime_Ideal_ShortInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Bedtime_Ideal_ShortInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_bedtime_ideal_short(inputs)
	return fr_today_bedtime_ideal_short(inputs)
});