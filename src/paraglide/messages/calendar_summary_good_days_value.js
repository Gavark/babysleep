/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ good: NonNullable<unknown>, total: NonNullable<unknown> }} Calendar_Summary_Good_Days_ValueInputs */

const fr_calendar_summary_good_days_value = /** @type {(inputs: Calendar_Summary_Good_Days_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.good} / ${i?.total}`)
};

const en_calendar_summary_good_days_value = /** @type {(inputs: Calendar_Summary_Good_Days_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.good} / ${i?.total}`)
};

/**
* | output |
* | --- |
* | "{good} / {total}" |
*
* @param {Calendar_Summary_Good_Days_ValueInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_summary_good_days_value = /** @type {((inputs: Calendar_Summary_Good_Days_ValueInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Summary_Good_Days_ValueInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_summary_good_days_value(inputs)
	return fr_calendar_summary_good_days_value(inputs)
});