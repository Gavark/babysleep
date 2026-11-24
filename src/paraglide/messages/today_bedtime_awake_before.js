/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Today_Bedtime_Awake_BeforeInputs */

const fr_today_bedtime_awake_before = /** @type {(inputs: Today_Bedtime_Awake_BeforeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.duration} après la sieste`)
};

const en_today_bedtime_awake_before = /** @type {(inputs: Today_Bedtime_Awake_BeforeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.duration} after the last nap`)
};

/**
* | output |
* | --- |
* | "{duration} after the last nap" |
*
* @param {Today_Bedtime_Awake_BeforeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_bedtime_awake_before = /** @type {((inputs: Today_Bedtime_Awake_BeforeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Bedtime_Awake_BeforeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_bedtime_awake_before(inputs)
	return fr_today_bedtime_awake_before(inputs)
});