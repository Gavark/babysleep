/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Password_Label_With_MinInputs */

const fr_auth_password_label_with_min = /** @type {(inputs: Auth_Password_Label_With_MinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mot de passe (≥ 10 caractères)`)
};

const en_auth_password_label_with_min = /** @type {(inputs: Auth_Password_Label_With_MinInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password (≥ 10 characters)`)
};

/**
* | output |
* | --- |
* | "Password (≥ 10 characters)" |
*
* @param {Auth_Password_Label_With_MinInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_password_label_with_min = /** @type {((inputs?: Auth_Password_Label_With_MinInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Password_Label_With_MinInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_password_label_with_min(inputs)
	return en_auth_password_label_with_min(inputs)
});