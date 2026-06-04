/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Tz_LabelInputs */

const fr_today_tz_label = /** @type {(inputs: Today_Tz_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fuseau actif :`)
};

const en_today_tz_label = /** @type {(inputs: Today_Tz_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active time zone:`)
};

/**
* | output |
* | --- |
* | "Active time zone:" |
*
* @param {Today_Tz_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_tz_label = /** @type {((inputs?: Today_Tz_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Tz_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_tz_label(inputs)
	return en_today_tz_label(inputs)
});