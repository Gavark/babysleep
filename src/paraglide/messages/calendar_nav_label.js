/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Nav_LabelInputs */

const fr_calendar_nav_label = /** @type {(inputs: Calendar_Nav_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Navigation mensuelle`)
};

const en_calendar_nav_label = /** @type {(inputs: Calendar_Nav_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly navigation`)
};

/**
* | output |
* | --- |
* | "Monthly navigation" |
*
* @param {Calendar_Nav_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_nav_label = /** @type {((inputs?: Calendar_Nav_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Nav_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_nav_label(inputs)
	return en_calendar_nav_label(inputs)
});