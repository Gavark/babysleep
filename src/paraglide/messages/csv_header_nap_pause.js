/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown> }} Csv_Header_Nap_PauseInputs */

const fr_csv_header_nap_pause = /** @type {(inputs: Csv_Header_Nap_PauseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n} pause (min)`)
};

const en_csv_header_nap_pause = /** @type {(inputs: Csv_Header_Nap_PauseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n} pause (min)`)
};

/**
* | output |
* | --- |
* | "S{n} pause (min)" |
*
* @param {Csv_Header_Nap_PauseInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const csv_header_nap_pause = /** @type {((inputs: Csv_Header_Nap_PauseInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Csv_Header_Nap_PauseInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_csv_header_nap_pause(inputs)
	return en_csv_header_nap_pause(inputs)
});