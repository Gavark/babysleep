/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Calendar_Cell_No_DataInputs */

const fr_calendar_cell_no_data = /** @type {(inputs: Calendar_Cell_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucune donnée`)
};

const en_calendar_cell_no_data = /** @type {(inputs: Calendar_Cell_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no data`)
};

/**
* | output |
* | --- |
* | "no data" |
*
* @param {Calendar_Cell_No_DataInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_cell_no_data = /** @type {((inputs?: Calendar_Cell_No_DataInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Cell_No_DataInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_cell_no_data(inputs)
	return en_calendar_cell_no_data(inputs)
});