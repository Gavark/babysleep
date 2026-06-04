/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Strip_LabelInputs */

const fr_calendar_strip_label = /** @type {(inputs: Calendar_Strip_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Liste des journées du mois`)
};

const en_calendar_strip_label = /** @type {(inputs: Calendar_Strip_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`List of days in the month`)
};

/**
* | output |
* | --- |
* | "List of days in the month" |
*
* @param {Calendar_Strip_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_strip_label = /** @type {((inputs?: Calendar_Strip_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Strip_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_strip_label(inputs)
	return en_calendar_strip_label(inputs)
});