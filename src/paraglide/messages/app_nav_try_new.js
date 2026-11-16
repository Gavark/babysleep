/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_Try_NewInputs */

const fr_app_nav_try_new = /** @type {(inputs: App_Nav_Try_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Essayer la nouvelle navigation`)
};

const en_app_nav_try_new = /** @type {(inputs: App_Nav_Try_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try the new navigation`)
};

/**
* | output |
* | --- |
* | "Try the new navigation" |
*
* @param {App_Nav_Try_NewInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_try_new = /** @type {((inputs?: App_Nav_Try_NewInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_Try_NewInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_app_nav_try_new(inputs)
	return fr_app_nav_try_new(inputs)
});