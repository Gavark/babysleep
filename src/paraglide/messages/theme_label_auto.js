/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Theme_Label_AutoInputs */

const fr_theme_label_auto = /** @type {(inputs: Theme_Label_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thème : automatique (clic pour clair)`)
};

const en_theme_label_auto = /** @type {(inputs: Theme_Label_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Theme: automatic (click for light)`)
};

/**
* | output |
* | --- |
* | "Theme: automatic (click for light)" |
*
* @param {Theme_Label_AutoInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const theme_label_auto = /** @type {((inputs?: Theme_Label_AutoInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Theme_Label_AutoInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_theme_label_auto(inputs)
	return en_theme_label_auto(inputs)
});