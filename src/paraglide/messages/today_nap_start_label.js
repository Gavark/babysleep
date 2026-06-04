/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Nap_Start_LabelInputs */

const fr_today_nap_start_label = /** @type {(inputs: Today_Nap_Start_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Début`)
};

const en_today_nap_start_label = /** @type {(inputs: Today_Nap_Start_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start`)
};

/**
* | output |
* | --- |
* | "Start" |
*
* @param {Today_Nap_Start_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_nap_start_label = /** @type {((inputs?: Today_Nap_Start_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Nap_Start_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_nap_start_label(inputs)
	return en_today_nap_start_label(inputs)
});