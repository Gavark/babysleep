/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Today_Day_Budget_ExceededInputs */

const fr_today_day_budget_exceeded = /** @type {(inputs: Today_Day_Budget_ExceededInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Budget dépassé de ${i?.amount}.`)
};

const en_today_day_budget_exceeded = /** @type {(inputs: Today_Day_Budget_ExceededInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Budget exceeded by ${i?.amount}.`)
};

/**
* | output |
* | --- |
* | "Budget exceeded by {amount}." |
*
* @param {Today_Day_Budget_ExceededInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_day_budget_exceeded = /** @type {((inputs: Today_Day_Budget_ExceededInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Day_Budget_ExceededInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_day_budget_exceeded(inputs)
	return en_today_day_budget_exceeded(inputs)
});