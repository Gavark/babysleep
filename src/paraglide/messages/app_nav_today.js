/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_TodayInputs */

const fr_app_nav_today = /** @type {(inputs: App_Nav_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aujourd'hui`)
};

const en_app_nav_today = /** @type {(inputs: App_Nav_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today`)
};

/**
* | output |
* | --- |
* | "Today" |
*
* @param {App_Nav_TodayInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_today = /** @type {((inputs?: App_Nav_TodayInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_TodayInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_today(inputs)
	return en_app_nav_today(inputs)
});