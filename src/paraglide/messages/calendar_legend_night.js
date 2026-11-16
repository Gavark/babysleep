/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_NightInputs */

const fr_calendar_legend_night = /** @type {(inputs: Calendar_Legend_NightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nuit`)
};

const en_calendar_legend_night = /** @type {(inputs: Calendar_Legend_NightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Night`)
};

/**
* | output |
* | --- |
* | "Night" |
*
* @param {Calendar_Legend_NightInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_night = /** @type {((inputs?: Calendar_Legend_NightInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_NightInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_legend_night(inputs)
	return fr_calendar_legend_night(inputs)
});