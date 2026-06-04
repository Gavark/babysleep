/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Day_Budget_DoneInputs */

const fr_today_day_budget_done = /** @type {(inputs: Today_Day_Budget_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Effectué`)
};

const en_today_day_budget_done = /** @type {(inputs: Today_Day_Budget_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Done`)
};

/**
* | output |
* | --- |
* | "Done" |
*
* @param {Today_Day_Budget_DoneInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_day_budget_done = /** @type {((inputs?: Today_Day_Budget_DoneInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Day_Budget_DoneInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_day_budget_done(inputs)
	return en_today_day_budget_done(inputs)
});