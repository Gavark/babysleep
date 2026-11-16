/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ start: NonNullable<unknown> }} Today_Row_Nap_ProgressInputs */

const fr_today_row_nap_progress = /** @type {(inputs: Today_Row_Nap_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.start} – …`)
};

const en_today_row_nap_progress = /** @type {(inputs: Today_Row_Nap_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.start} – …`)
};

/**
* | output |
* | --- |
* | "{start} – …" |
*
* @param {Today_Row_Nap_ProgressInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_row_nap_progress = /** @type {((inputs: Today_Row_Nap_ProgressInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Row_Nap_ProgressInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_row_nap_progress(inputs)
	return fr_today_row_nap_progress(inputs)
});