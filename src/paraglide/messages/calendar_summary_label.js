/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Summary_LabelInputs */

const fr_calendar_summary_label = /** @type {(inputs: Calendar_Summary_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Résumé du mois`)
};

const en_calendar_summary_label = /** @type {(inputs: Calendar_Summary_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Month summary`)
};

/**
* | output |
* | --- |
* | "Month summary" |
*
* @param {Calendar_Summary_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_summary_label = /** @type {((inputs?: Calendar_Summary_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Summary_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_summary_label(inputs)
	return fr_calendar_summary_label(inputs)
});