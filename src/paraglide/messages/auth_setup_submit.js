/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Setup_SubmitInputs */

const fr_auth_setup_submit = /** @type {(inputs: Auth_Setup_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer le compte`)
};

const en_auth_setup_submit = /** @type {(inputs: Auth_Setup_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create account`)
};

/**
* | output |
* | --- |
* | "Create account" |
*
* @param {Auth_Setup_SubmitInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_setup_submit = /** @type {((inputs?: Auth_Setup_SubmitInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Setup_SubmitInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_setup_submit(inputs)
	return en_auth_setup_submit(inputs)
});