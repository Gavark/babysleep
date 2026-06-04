/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Stats_EmptyInputs */

const fr_stats_empty = /** @type {(inputs: Stats_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas de données sur cette période.`)
};

const en_stats_empty = /** @type {(inputs: Stats_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No data in this period.`)
};

/**
* | output |
* | --- |
* | "No data in this period." |
*
* @param {Stats_EmptyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const stats_empty = /** @type {((inputs?: Stats_EmptyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stats_EmptyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_stats_empty(inputs)
	return en_stats_empty(inputs)
});