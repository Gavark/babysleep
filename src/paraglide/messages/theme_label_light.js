/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Theme_Label_LightInputs */

const fr_theme_label_light = /** @type {(inputs: Theme_Label_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thème : clair (clic pour sombre)`)
};

const en_theme_label_light = /** @type {(inputs: Theme_Label_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Theme: light (click for dark)`)
};

/**
* | output |
* | --- |
* | "Theme: light (click for dark)" |
*
* @param {Theme_Label_LightInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const theme_label_light = /** @type {((inputs?: Theme_Label_LightInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Theme_Label_LightInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_theme_label_light(inputs)
	return en_theme_label_light(inputs)
});