/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Summary_Mean_BedtimeInputs */

const fr_history_summary_mean_bedtime = /** @type {(inputs: History_Summary_Mean_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coucher moyen`)
};

const en_history_summary_mean_bedtime = /** @type {(inputs: History_Summary_Mean_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mean bedtime`)
};

/**
* | output |
* | --- |
* | "Mean bedtime" |
*
* @param {History_Summary_Mean_BedtimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_summary_mean_bedtime = /** @type {((inputs?: History_Summary_Mean_BedtimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Summary_Mean_BedtimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_summary_mean_bedtime(inputs)
	return en_history_summary_mean_bedtime(inputs)
});