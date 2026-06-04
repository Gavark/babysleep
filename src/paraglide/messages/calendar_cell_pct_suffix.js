/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ pct: NonNullable<unknown> }} Calendar_Cell_Pct_SuffixInputs */

const fr_calendar_cell_pct_suffix = /** @type {(inputs: Calendar_Cell_Pct_SuffixInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (${i?.pct}% du quota)`)
};

const en_calendar_cell_pct_suffix = /** @type {(inputs: Calendar_Cell_Pct_SuffixInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (${i?.pct}% of recommended)`)
};

/**
* | output |
* | --- |
* | "({pct}% of recommended)" |
*
* @param {Calendar_Cell_Pct_SuffixInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_cell_pct_suffix = /** @type {((inputs: Calendar_Cell_Pct_SuffixInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Cell_Pct_SuffixInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_cell_pct_suffix(inputs)
	return en_calendar_cell_pct_suffix(inputs)
});