/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} History_Summary_EntriesInputs */

const fr_history_summary_entries = /** @type {(inputs: History_Summary_EntriesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} jour(s)`)
};

const en_history_summary_entries = /** @type {(inputs: History_Summary_EntriesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} day(s)`)
};

/**
* | output |
* | --- |
* | "{count} day(s)" |
*
* @param {History_Summary_EntriesInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const history_summary_entries = /** @type {((inputs: History_Summary_EntriesInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<History_Summary_EntriesInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_history_summary_entries(inputs)
	return en_history_summary_entries(inputs)
});