/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_MenuInputs */

const fr_app_nav_menu = /** @type {(inputs: App_Nav_MenuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Menu`)
};

const en_app_nav_menu = /** @type {(inputs: App_Nav_MenuInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Menu`)
};

/**
* | output |
* | --- |
* | "Menu" |
*
* @param {App_Nav_MenuInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_menu = /** @type {((inputs?: App_Nav_MenuInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_MenuInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_app_nav_menu(inputs)
	return fr_app_nav_menu(inputs)
});