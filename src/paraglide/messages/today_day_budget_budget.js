/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Day_Budget_BudgetInputs */

const fr_today_day_budget_budget = /** @type {(inputs: Today_Day_Budget_BudgetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Budget`)
};

const en_today_day_budget_budget = /** @type {(inputs: Today_Day_Budget_BudgetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Budget`)
};

/**
* | output |
* | --- |
* | "Budget" |
*
* @param {Today_Day_Budget_BudgetInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_day_budget_budget = /** @type {((inputs?: Today_Day_Budget_BudgetInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Day_Budget_BudgetInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_day_budget_budget(inputs)
	return en_today_day_budget_budget(inputs)
});