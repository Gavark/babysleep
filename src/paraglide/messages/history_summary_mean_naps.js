/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Summary_Mean_NapsInputs */

const fr_history_summary_mean_naps = /** @type {(inputs: History_Summary_Mean_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Siestes/jour`)
};

const en_history_summary_mean_naps = /** @type {(inputs: History_Summary_Mean_NapsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Naps/day`)
};

/**
* | output |
* | --- |
* | "Naps/day" |
*
* @param {History_Summary_Mean_NapsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_summary_mean_naps = /** @type {((inputs?: History_Summary_Mean_NapsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Summary_Mean_NapsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_summary_mean_naps(inputs)
	return en_history_summary_mean_naps(inputs)
});