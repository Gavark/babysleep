/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ duration: NonNullable<unknown> }} Calendar_Week_AvgInputs */

const fr_calendar_week_avg = /** @type {(inputs: Calendar_Week_AvgInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`moy. ${i?.duration}`)
};

const en_calendar_week_avg = /** @type {(inputs: Calendar_Week_AvgInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`avg ${i?.duration}`)
};

/**
* | output |
* | --- |
* | "avg {duration}" |
*
* @param {Calendar_Week_AvgInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_week_avg = /** @type {((inputs: Calendar_Week_AvgInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Week_AvgInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_calendar_week_avg(inputs)
	return fr_calendar_week_avg(inputs)
});