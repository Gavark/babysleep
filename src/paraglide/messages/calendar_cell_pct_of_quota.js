/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ pct: NonNullable<unknown> }} Calendar_Cell_Pct_Of_QuotaInputs */

const fr_calendar_cell_pct_of_quota = /** @type {(inputs: Calendar_Cell_Pct_Of_QuotaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct} pourcent du quota recommandé`)
};

const en_calendar_cell_pct_of_quota = /** @type {(inputs: Calendar_Cell_Pct_Of_QuotaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct} percent of recommended`)
};

/**
* | output |
* | --- |
* | "{pct} percent of recommended" |
*
* @param {Calendar_Cell_Pct_Of_QuotaInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const calendar_cell_pct_of_quota = /** @type {((inputs: Calendar_Cell_Pct_Of_QuotaInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Calendar_Cell_Pct_Of_QuotaInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_calendar_cell_pct_of_quota(inputs)
	return en_calendar_cell_pct_of_quota(inputs)
});