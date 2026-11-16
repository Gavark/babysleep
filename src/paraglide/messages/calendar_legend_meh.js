/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_MehInputs */

const fr_calendar_legend_meh = /** @type {(inputs: Calendar_Legend_MehInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`50–70 %`)
};

const en_calendar_legend_meh = /** @type {(inputs: Calendar_Legend_MehInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`50–70%`)
};

/**
* | output |
* | --- |
* | "50–70%" |
*
* @param {Calendar_Legend_MehInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_meh = /** @type {((inputs?: Calendar_Legend_MehInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_MehInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_legend_meh(inputs)
	return fr_calendar_legend_meh(inputs)
});