/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ n: NonNullable<unknown> }} History_Table_Nap_Short_NInputs */

const fr_history_table_nap_short_n = /** @type {(inputs: History_Table_Nap_Short_NInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`S${i?.n}`)
};

const en_history_table_nap_short_n = /** @type {(inputs: History_Table_Nap_Short_NInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`N${i?.n}`)
};

/**
* | output |
* | --- |
* | "N{n}" |
*
* @param {History_Table_Nap_Short_NInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_table_nap_short_n = /** @type {((inputs: History_Table_Nap_Short_NInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Table_Nap_Short_NInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_table_nap_short_n(inputs)
	return en_history_table_nap_short_n(inputs)
});