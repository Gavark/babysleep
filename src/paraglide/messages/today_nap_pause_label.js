/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Nap_Pause_LabelInputs */

const fr_today_nap_pause_label = /** @type {(inputs: Today_Nap_Pause_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pause (min)`)
};

const en_today_nap_pause_label = /** @type {(inputs: Today_Nap_Pause_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pause (min)`)
};

/**
* | output |
* | --- |
* | "Pause (min)" |
*
* @param {Today_Nap_Pause_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_nap_pause_label = /** @type {((inputs?: Today_Nap_Pause_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Nap_Pause_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_nap_pause_label(inputs)
	return en_today_nap_pause_label(inputs)
});