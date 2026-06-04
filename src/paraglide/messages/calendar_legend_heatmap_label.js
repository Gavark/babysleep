/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_Heatmap_LabelInputs */

const fr_calendar_legend_heatmap_label = /** @type {(inputs: Calendar_Legend_Heatmap_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couleur du jour = % du quota de sommeil atteint`)
};

const en_calendar_legend_heatmap_label = /** @type {(inputs: Calendar_Legend_Heatmap_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day color = % of recommended sleep reached`)
};

/**
* | output |
* | --- |
* | "Day color = % of recommended sleep reached" |
*
* @param {Calendar_Legend_Heatmap_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_heatmap_label = /** @type {((inputs?: Calendar_Legend_Heatmap_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_Heatmap_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_legend_heatmap_label(inputs)
	return en_calendar_legend_heatmap_label(inputs)
});