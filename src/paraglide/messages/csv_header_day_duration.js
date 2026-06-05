/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Csv_Header_Day_DurationInputs */

const fr_csv_header_day_duration = /** @type {(inputs: Csv_Header_Day_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée jour`)
};

const en_csv_header_day_duration = /** @type {(inputs: Csv_Header_Day_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day duration`)
};

/**
* | output |
* | --- |
* | "Day duration" |
*
* @param {Csv_Header_Day_DurationInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_day_duration = /** @type {((inputs?: Csv_Header_Day_DurationInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_Day_DurationInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_day_duration(inputs)
	return en_csv_header_day_duration(inputs)
});