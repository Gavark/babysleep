/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Today_Day_Budget_TitleInputs */

const fr_today_day_budget_title = /** @type {(inputs: Today_Day_Budget_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sommeil de jour`)
};

const en_today_day_budget_title = /** @type {(inputs: Today_Day_Budget_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Daytime sleep`)
};

/**
* | output |
* | --- |
* | "Daytime sleep" |
*
* @param {Today_Day_Budget_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_day_budget_title = /** @type {((inputs?: Today_Day_Budget_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Day_Budget_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_today_day_budget_title(inputs)
	return en_today_day_budget_title(inputs)
});