/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ time: NonNullable<unknown> }} Calendar_Cell_Wake_PrefixInputs */

const fr_calendar_cell_wake_prefix = /** @type {(inputs: Calendar_Cell_Wake_PrefixInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lever ${i?.time}`)
};

const en_calendar_cell_wake_prefix = /** @type {(inputs: Calendar_Cell_Wake_PrefixInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Wake ${i?.time}`)
};

/**
* | output |
* | --- |
* | "Wake {time}" |
*
* @param {Calendar_Cell_Wake_PrefixInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_cell_wake_prefix = /** @type {((inputs: Calendar_Cell_Wake_PrefixInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Cell_Wake_PrefixInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_cell_wake_prefix(inputs)
	return en_calendar_cell_wake_prefix(inputs)
});