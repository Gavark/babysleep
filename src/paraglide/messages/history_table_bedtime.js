/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Table_BedtimeInputs */

const fr_history_table_bedtime = /** @type {(inputs: History_Table_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coucher`)
};

const en_history_table_bedtime = /** @type {(inputs: History_Table_BedtimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bedtime`)
};

/**
* | output |
* | --- |
* | "Bedtime" |
*
* @param {History_Table_BedtimeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_table_bedtime = /** @type {((inputs?: History_Table_BedtimeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Table_BedtimeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_table_bedtime(inputs)
	return en_history_table_bedtime(inputs)
});