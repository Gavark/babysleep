/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Theme_Label_DarkInputs */

const fr_theme_label_dark = /** @type {(inputs: Theme_Label_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thème : sombre (clic pour automatique)`)
};

const en_theme_label_dark = /** @type {(inputs: Theme_Label_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Theme: dark (click for automatic)`)
};

/**
* | output |
* | --- |
* | "Theme: dark (click for automatic)" |
*
* @param {Theme_Label_DarkInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const theme_label_dark = /** @type {((inputs?: Theme_Label_DarkInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Theme_Label_DarkInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_theme_label_dark(inputs)
	return en_theme_label_dark(inputs)
});