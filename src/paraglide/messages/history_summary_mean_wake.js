/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Summary_Mean_WakeInputs */

const fr_history_summary_mean_wake = /** @type {(inputs: History_Summary_Mean_WakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réveil moyen`)
};

const en_history_summary_mean_wake = /** @type {(inputs: History_Summary_Mean_WakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mean wake-up`)
};

/**
* | output |
* | --- |
* | "Mean wake-up" |
*
* @param {History_Summary_Mean_WakeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_summary_mean_wake = /** @type {((inputs?: History_Summary_Mean_WakeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Summary_Mean_WakeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_summary_mean_wake(inputs)
	return en_history_summary_mean_wake(inputs)
});