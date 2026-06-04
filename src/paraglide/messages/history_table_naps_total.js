/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Table_Naps_TotalInputs */

const fr_history_table_naps_total = /** @type {(inputs: History_Table_Naps_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Σ Siestes`)
};

const en_history_table_naps_total = /** @type {(inputs: History_Table_Naps_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Σ Naps`)
};

/**
* | output |
* | --- |
* | "Σ Naps" |
*
* @param {History_Table_Naps_TotalInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_table_naps_total = /** @type {((inputs?: History_Table_Naps_TotalInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Table_Naps_TotalInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_table_naps_total(inputs)
	return en_history_table_naps_total(inputs)
});