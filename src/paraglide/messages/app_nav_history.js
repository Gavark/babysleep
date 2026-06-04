/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_HistoryInputs */

const fr_app_nav_history = /** @type {(inputs: App_Nav_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Historique`)
};

const en_app_nav_history = /** @type {(inputs: App_Nav_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`History`)
};

/**
* | output |
* | --- |
* | "History" |
*
* @param {App_Nav_HistoryInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_history = /** @type {((inputs?: App_Nav_HistoryInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_HistoryInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_history(inputs)
	return en_app_nav_history(inputs)
});