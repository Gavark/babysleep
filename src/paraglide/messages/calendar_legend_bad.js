/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_BadInputs */

const fr_calendar_legend_bad = /** @type {(inputs: Calendar_Legend_BadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`< 50 %`)
};

const en_calendar_legend_bad = /** @type {(inputs: Calendar_Legend_BadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`< 50%`)
};

/**
* | output |
* | --- |
* | "< 50%" |
*
* @param {Calendar_Legend_BadInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_bad = /** @type {((inputs?: Calendar_Legend_BadInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_BadInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_legend_bad(inputs)
	return fr_calendar_legend_bad(inputs)
});