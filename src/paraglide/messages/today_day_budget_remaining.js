/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Day_Budget_RemainingInputs */

const fr_today_day_budget_remaining = /** @type {(inputs: Today_Day_Budget_RemainingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restant`)
};

const en_today_day_budget_remaining = /** @type {(inputs: Today_Day_Budget_RemainingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remaining`)
};

/**
* | output |
* | --- |
* | "Remaining" |
*
* @param {Today_Day_Budget_RemainingInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_day_budget_remaining = /** @type {((inputs?: Today_Day_Budget_RemainingInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Day_Budget_RemainingInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_day_budget_remaining(inputs)
	return en_today_day_budget_remaining(inputs)
});