/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_LabelInputs */

const fr_calendar_legend_label = /** @type {(inputs: Calendar_Legend_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Légende`)
};

const en_calendar_legend_label = /** @type {(inputs: Calendar_Legend_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Legend`)
};

/**
* | output |
* | --- |
* | "Legend" |
*
* @param {Calendar_Legend_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_label = /** @type {((inputs?: Calendar_Legend_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_legend_label(inputs)
	return en_calendar_legend_label(inputs)
});