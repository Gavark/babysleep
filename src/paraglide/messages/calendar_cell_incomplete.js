/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Cell_IncompleteInputs */

const fr_calendar_cell_incomplete = /** @type {(inputs: Calendar_Cell_IncompleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`journée incomplète`)
};

const en_calendar_cell_incomplete = /** @type {(inputs: Calendar_Cell_IncompleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`incomplete day`)
};

/**
* | output |
* | --- |
* | "incomplete day" |
*
* @param {Calendar_Cell_IncompleteInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_cell_incomplete = /** @type {((inputs?: Calendar_Cell_IncompleteInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Cell_IncompleteInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_cell_incomplete(inputs)
	return en_calendar_cell_incomplete(inputs)
});