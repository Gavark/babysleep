/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_EditInputs */

const fr_app_nav_edit = /** @type {(inputs: App_Nav_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Éditer`)
};

const en_app_nav_edit = /** @type {(inputs: App_Nav_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit`)
};

/**
* | output |
* | --- |
* | "Edit" |
*
* @param {App_Nav_EditInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_edit = /** @type {((inputs?: App_Nav_EditInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_EditInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_edit(inputs)
	return en_app_nav_edit(inputs)
});