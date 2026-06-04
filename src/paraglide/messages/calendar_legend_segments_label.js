/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_Segments_LabelInputs */

const fr_calendar_legend_segments_label = /** @type {(inputs: Calendar_Legend_Segments_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Segments dans la barre 24h`)
};

const en_calendar_legend_segments_label = /** @type {(inputs: Calendar_Legend_Segments_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Segments in the 24h bar`)
};

/**
* | output |
* | --- |
* | "Segments in the 24h bar" |
*
* @param {Calendar_Legend_Segments_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_segments_label = /** @type {((inputs?: Calendar_Legend_Segments_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_Segments_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_legend_segments_label(inputs)
	return en_calendar_legend_segments_label(inputs)
});