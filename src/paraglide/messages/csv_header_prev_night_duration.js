/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Csv_Header_Prev_Night_DurationInputs */

const fr_csv_header_prev_night_duration = /** @type {(inputs: Csv_Header_Prev_Night_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée nuit préc.`)
};

const en_csv_header_prev_night_duration = /** @type {(inputs: Csv_Header_Prev_Night_DurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prev. night duration`)
};

/**
* | output |
* | --- |
* | "Prev. night duration" |
*
* @param {Csv_Header_Prev_Night_DurationInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_prev_night_duration = /** @type {((inputs?: Csv_Header_Prev_Night_DurationInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_Prev_Night_DurationInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_prev_night_duration(inputs)
	return en_csv_header_prev_night_duration(inputs)
});