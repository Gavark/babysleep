/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Wake_LabelInputs */

const fr_today_wake_label = /** @type {(inputs: Today_Wake_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réveil`)
};

const en_today_wake_label = /** @type {(inputs: Today_Wake_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wake-up`)
};

/**
* | output |
* | --- |
* | "Wake-up" |
*
* @param {Today_Wake_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_wake_label = /** @type {((inputs?: Today_Wake_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Wake_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_wake_label(inputs)
	return en_today_wake_label(inputs)
});