/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} History_Table_WakeInputs */

const fr_history_table_wake = /** @type {(inputs: History_Table_WakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réveil`)
};

const en_history_table_wake = /** @type {(inputs: History_Table_WakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wake`)
};

/**
* | output |
* | --- |
* | "Wake" |
*
* @param {History_Table_WakeInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_table_wake = /** @type {((inputs?: History_Table_WakeInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Table_WakeInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_table_wake(inputs)
	return en_history_table_wake(inputs)
});