/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landing_Window_Chart_TitleInputs */

const fr_landing_window_chart_title = /** @type {(inputs: Landing_Window_Chart_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée d'éveil entre deux siestes, par tranche d'âge`)
};

const en_landing_window_chart_title = /** @type {(inputs: Landing_Window_Chart_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awake time between two naps, by age bracket`)
};

/**
* | output |
* | --- |
* | "Awake time between two naps, by age bracket" |
*
* @param {Landing_Window_Chart_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const landing_window_chart_title = /** @type {((inputs?: Landing_Window_Chart_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landing_Window_Chart_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_landing_window_chart_title(inputs)
	return en_landing_window_chart_title(inputs)
});