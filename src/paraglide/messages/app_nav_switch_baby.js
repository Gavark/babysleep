/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_Switch_BabyInputs */

const fr_app_nav_switch_baby = /** @type {(inputs: App_Nav_Switch_BabyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer de bébé`)
};

const en_app_nav_switch_baby = /** @type {(inputs: App_Nav_Switch_BabyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Switch baby`)
};

/**
* | output |
* | --- |
* | "Switch baby" |
*
* @param {App_Nav_Switch_BabyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_switch_baby = /** @type {((inputs?: App_Nav_Switch_BabyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_Switch_BabyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_app_nav_switch_baby(inputs)
	return fr_app_nav_switch_baby(inputs)
});