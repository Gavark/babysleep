/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Setup_Confirm_LabelInputs */

const fr_auth_setup_confirm_label = /** @type {(inputs: Auth_Setup_Confirm_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmer le mot de passe`)
};

const en_auth_setup_confirm_label = /** @type {(inputs: Auth_Setup_Confirm_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm password`)
};

/**
* | output |
* | --- |
* | "Confirm password" |
*
* @param {Auth_Setup_Confirm_LabelInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_setup_confirm_label = /** @type {((inputs?: Auth_Setup_Confirm_LabelInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Setup_Confirm_LabelInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_setup_confirm_label(inputs)
	return en_auth_setup_confirm_label(inputs)
});