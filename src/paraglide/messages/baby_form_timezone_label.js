/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Timezone_LabelInputs */

const fr_baby_form_timezone_label = /** @type {(inputs: Baby_Form_Timezone_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fuseau horaire (override)`)
};

const en_baby_form_timezone_label = /** @type {(inputs: Baby_Form_Timezone_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time zone (override)`)
};

/**
* | output |
* | --- |
* | "Time zone (override)" |
*
* @param {Baby_Form_Timezone_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_timezone_label = /** @type {((inputs?: Baby_Form_Timezone_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Timezone_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_timezone_label(inputs)
	return en_baby_form_timezone_label(inputs)
});