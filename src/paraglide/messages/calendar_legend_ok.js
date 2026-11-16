/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_OkInputs */

const fr_calendar_legend_ok = /** @type {(inputs: Calendar_Legend_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`70–90 %`)
};

const en_calendar_legend_ok = /** @type {(inputs: Calendar_Legend_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`70–90%`)
};

/**
* | output |
* | --- |
* | "70–90%" |
*
* @param {Calendar_Legend_OkInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_ok = /** @type {((inputs?: Calendar_Legend_OkInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_OkInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_legend_ok(inputs)
	return fr_calendar_legend_ok(inputs)
});