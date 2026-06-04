/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Grid_LabelInputs */

const fr_calendar_grid_label = /** @type {(inputs: Calendar_Grid_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calendrier mensuel`)
};

const en_calendar_grid_label = /** @type {(inputs: Calendar_Grid_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly calendar`)
};

/**
* | output |
* | --- |
* | "Monthly calendar" |
*
* @param {Calendar_Grid_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_grid_label = /** @type {((inputs?: Calendar_Grid_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Grid_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_grid_label(inputs)
	return en_calendar_grid_label(inputs)
});