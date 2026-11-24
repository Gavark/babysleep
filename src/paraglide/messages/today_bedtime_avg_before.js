/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Today_Bedtime_Avg_BeforeInputs */

const fr_today_bedtime_avg_before = /** @type {(inputs: Today_Bedtime_Avg_BeforeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.duration} après la dernière sieste en moyenne (30 j)`)
};

const en_today_bedtime_avg_before = /** @type {(inputs: Today_Bedtime_Avg_BeforeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.duration} after the last nap on average (30 d)`)
};

/**
* | output |
* | --- |
* | "{duration} after the last nap on average (30 d)" |
*
* @param {Today_Bedtime_Avg_BeforeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_bedtime_avg_before = /** @type {((inputs: Today_Bedtime_Avg_BeforeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Bedtime_Avg_BeforeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_bedtime_avg_before(inputs)
	return fr_today_bedtime_avg_before(inputs)
});