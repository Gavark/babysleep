/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Window_TitleInputs */

const fr_landing_window_title = /** @type {(inputs: Landing_Window_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La fenêtre d'éveil`)
};

const en_landing_window_title = /** @type {(inputs: Landing_Window_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The wake window`)
};

/**
* | output |
* | --- |
* | "The wake window" |
*
* @param {Landing_Window_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_window_title = /** @type {((inputs?: Landing_Window_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Window_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_window_title(inputs)
	return en_landing_window_title(inputs)
});