/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Table_Naps_CountInputs */

const fr_history_table_naps_count = /** @type {(inputs: History_Table_Naps_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nb`)
};

const en_history_table_naps_count = /** @type {(inputs: History_Table_Naps_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Count`)
};

/**
* | output |
* | --- |
* | "Count" |
*
* @param {History_Table_Naps_CountInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_table_naps_count = /** @type {((inputs?: History_Table_Naps_CountInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Table_Naps_CountInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_table_naps_count(inputs)
	return en_history_table_naps_count(inputs)
});