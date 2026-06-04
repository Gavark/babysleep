/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_StatsInputs */

const fr_app_nav_stats = /** @type {(inputs: App_Nav_StatsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stats`)
};

const en_app_nav_stats = /** @type {(inputs: App_Nav_StatsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stats`)
};

/**
* | output |
* | --- |
* | "Stats" |
*
* @param {App_Nav_StatsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_stats = /** @type {((inputs?: App_Nav_StatsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_StatsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_stats(inputs)
	return en_app_nav_stats(inputs)
});