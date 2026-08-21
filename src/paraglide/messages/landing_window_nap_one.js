/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Window_Nap_OneInputs */

const fr_landing_window_nap_one = /** @type {(inputs: Landing_Window_Nap_OneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`1 sieste`)
};

const en_landing_window_nap_one = /** @type {(inputs: Landing_Window_Nap_OneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`1 nap`)
};

/**
* | output |
* | --- |
* | "1 nap" |
*
* @param {Landing_Window_Nap_OneInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_window_nap_one = /** @type {((inputs?: Landing_Window_Nap_OneInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Window_Nap_OneInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_window_nap_one(inputs)
	return en_landing_window_nap_one(inputs)
});