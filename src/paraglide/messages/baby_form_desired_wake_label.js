/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Baby_Form_Desired_Wake_LabelInputs */

const fr_baby_form_desired_wake_label = /** @type {(inputs: Baby_Form_Desired_Wake_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heure de réveil souhaitée`)
};

const en_baby_form_desired_wake_label = /** @type {(inputs: Baby_Form_Desired_Wake_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desired wake-up time`)
};

/**
* | output |
* | --- |
* | "Desired wake-up time" |
*
* @param {Baby_Form_Desired_Wake_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const baby_form_desired_wake_label = /** @type {((inputs?: Baby_Form_Desired_Wake_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Baby_Form_Desired_Wake_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_baby_form_desired_wake_label(inputs)
	return en_baby_form_desired_wake_label(inputs)
});