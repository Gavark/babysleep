/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_CalendarInputs */

const fr_app_nav_calendar = /** @type {(inputs: App_Nav_CalendarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calendrier`)
};

const en_app_nav_calendar = /** @type {(inputs: App_Nav_CalendarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calendar`)
};

/**
* | output |
* | --- |
* | "Calendar" |
*
* @param {App_Nav_CalendarInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_calendar = /** @type {((inputs?: App_Nav_CalendarInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_CalendarInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_calendar(inputs)
	return en_app_nav_calendar(inputs)
});