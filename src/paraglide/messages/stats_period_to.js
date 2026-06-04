/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Period_ToInputs */

const fr_stats_period_to = /** @type {(inputs: Stats_Period_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À`)
};

const en_stats_period_to = /** @type {(inputs: Stats_Period_ToInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To`)
};

/**
* | output |
* | --- |
* | "To" |
*
* @param {Stats_Period_ToInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_period_to = /** @type {((inputs?: Stats_Period_ToInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Period_ToInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_period_to(inputs)
	return en_stats_period_to(inputs)
});