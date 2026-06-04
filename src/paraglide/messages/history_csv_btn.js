/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Csv_BtnInputs */

const fr_history_csv_btn = /** @type {(inputs: History_Csv_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CSV`)
};

const en_history_csv_btn = /** @type {(inputs: History_Csv_BtnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CSV`)
};

/**
* | output |
* | --- |
* | "CSV" |
*
* @param {History_Csv_BtnInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_csv_btn = /** @type {((inputs?: History_Csv_BtnInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Csv_BtnInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_csv_btn(inputs)
	return en_history_csv_btn(inputs)
});