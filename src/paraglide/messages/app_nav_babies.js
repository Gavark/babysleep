/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_BabiesInputs */

const fr_app_nav_babies = /** @type {(inputs: App_Nav_BabiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bébés`)
};

const en_app_nav_babies = /** @type {(inputs: App_Nav_BabiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Babies`)
};

/**
* | output |
* | --- |
* | "Babies" |
*
* @param {App_Nav_BabiesInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_babies = /** @type {((inputs?: App_Nav_BabiesInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_BabiesInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_babies(inputs)
	return en_app_nav_babies(inputs)
});