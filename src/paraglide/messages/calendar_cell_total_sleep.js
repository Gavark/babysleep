/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Calendar_Cell_Total_SleepInputs */

const fr_calendar_cell_total_sleep = /** @type {(inputs: Calendar_Cell_Total_SleepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.duration} de sommeil`)
};

const en_calendar_cell_total_sleep = /** @type {(inputs: Calendar_Cell_Total_SleepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.duration} of sleep`)
};

/**
* | output |
* | --- |
* | "{duration} of sleep" |
*
* @param {Calendar_Cell_Total_SleepInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_cell_total_sleep = /** @type {((inputs: Calendar_Cell_Total_SleepInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Cell_Total_SleepInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_cell_total_sleep(inputs)
	return en_calendar_cell_total_sleep(inputs)
});