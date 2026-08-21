/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Landing_Window_NapsInputs */

const fr_landing_window_naps = /** @type {(inputs: Landing_Window_NapsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} siestes`)
};

const en_landing_window_naps = /** @type {(inputs: Landing_Window_NapsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} naps`)
};

/**
* | output |
* | --- |
* | "{count} naps" |
*
* @param {Landing_Window_NapsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_window_naps = /** @type {((inputs: Landing_Window_NapsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Window_NapsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_window_naps(inputs)
	return en_landing_window_naps(inputs)
});