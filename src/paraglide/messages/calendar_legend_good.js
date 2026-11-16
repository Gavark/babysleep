/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_GoodInputs */

const fr_calendar_legend_good = /** @type {(inputs: Calendar_Legend_GoodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`≥ 90 % du besoin`)
};

const en_calendar_legend_good = /** @type {(inputs: Calendar_Legend_GoodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`≥ 90% of need`)
};

/**
* | output |
* | --- |
* | "≥ 90% of need" |
*
* @param {Calendar_Legend_GoodInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_good = /** @type {((inputs?: Calendar_Legend_GoodInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_GoodInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_legend_good(inputs)
	return fr_calendar_legend_good(inputs)
});