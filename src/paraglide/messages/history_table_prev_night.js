/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Table_Prev_NightInputs */

const fr_history_table_prev_night = /** @type {(inputs: History_Table_Prev_NightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nuit préc.`)
};

const en_history_table_prev_night = /** @type {(inputs: History_Table_Prev_NightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prev. night`)
};

/**
* | output |
* | --- |
* | "Prev. night" |
*
* @param {History_Table_Prev_NightInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_table_prev_night = /** @type {((inputs?: History_Table_Prev_NightInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Table_Prev_NightInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_table_prev_night(inputs)
	return en_history_table_prev_night(inputs)
});