/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_Use_ClassicInputs */

const fr_app_nav_use_classic = /** @type {(inputs: App_Nav_Use_ClassicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Navigation classique`)
};

const en_app_nav_use_classic = /** @type {(inputs: App_Nav_Use_ClassicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Classic navigation`)
};

/**
* | output |
* | --- |
* | "Classic navigation" |
*
* @param {App_Nav_Use_ClassicInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_use_classic = /** @type {((inputs?: App_Nav_Use_ClassicInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_Use_ClassicInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_app_nav_use_classic(inputs)
	return fr_app_nav_use_classic(inputs)
});