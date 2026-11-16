/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Legend_PartialInputs */

const fr_calendar_legend_partial = /** @type {(inputs: Calendar_Legend_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`* journée incomplète`)
};

const en_calendar_legend_partial = /** @type {(inputs: Calendar_Legend_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`* incomplete day`)
};

/**
* | output |
* | --- |
* | "* incomplete day" |
*
* @param {Calendar_Legend_PartialInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_legend_partial = /** @type {((inputs?: Calendar_Legend_PartialInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Legend_PartialInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_legend_partial(inputs)
	return fr_calendar_legend_partial(inputs)
});