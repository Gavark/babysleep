/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Calendar_Cell_Total_PrefixInputs */

const fr_calendar_cell_total_prefix = /** @type {(inputs: Calendar_Cell_Total_PrefixInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Total ${i?.duration}`)
};

const en_calendar_cell_total_prefix = /** @type {(inputs: Calendar_Cell_Total_PrefixInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Total ${i?.duration}`)
};

/**
* | output |
* | --- |
* | "Total {duration}" |
*
* @param {Calendar_Cell_Total_PrefixInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_cell_total_prefix = /** @type {((inputs: Calendar_Cell_Total_PrefixInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Cell_Total_PrefixInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_cell_total_prefix(inputs)
	return en_calendar_cell_total_prefix(inputs)
});