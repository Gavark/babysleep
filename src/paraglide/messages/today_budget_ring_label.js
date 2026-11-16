/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown>, remaining: NonNullable<unknown> }} Today_Budget_Ring_LabelInputs */

const fr_today_budget_ring_label = /** @type {(inputs: Today_Budget_Ring_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sommeil de jour : ${i?.done} sur ${i?.total}, reste ${i?.remaining}`)
};

const en_today_budget_ring_label = /** @type {(inputs: Today_Budget_Ring_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Daytime sleep: ${i?.done} of ${i?.total}, ${i?.remaining} left`)
};

/**
* | output |
* | --- |
* | "Daytime sleep: {done} of {total}, {remaining} left" |
*
* @param {Today_Budget_Ring_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const today_budget_ring_label = /** @type {((inputs: Today_Budget_Ring_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Today_Budget_Ring_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "en") return en_today_budget_ring_label(inputs)
	return fr_today_budget_ring_label(inputs)
});