/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_Period_FromInputs */

const fr_stats_period_from = /** @type {(inputs: Stats_Period_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`De`)
};

const en_stats_period_from = /** @type {(inputs: Stats_Period_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From`)
};

/**
* | output |
* | --- |
* | "From" |
*
* @param {Stats_Period_FromInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_period_from = /** @type {((inputs?: Stats_Period_FromInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_Period_FromInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_period_from(inputs)
	return en_stats_period_from(inputs)
});