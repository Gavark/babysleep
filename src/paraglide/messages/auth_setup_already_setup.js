/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Setup_Already_SetupInputs */

const fr_auth_setup_already_setup = /** @type {(inputs: Auth_Setup_Already_SetupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un compte existe déjà. Recharge la page.`)
};

const en_auth_setup_already_setup = /** @type {(inputs: Auth_Setup_Already_SetupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An account already exists. Reload the page.`)
};

/**
* | output |
* | --- |
* | "An account already exists. Reload the page." |
*
* @param {Auth_Setup_Already_SetupInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_setup_already_setup = /** @type {((inputs?: Auth_Setup_Already_SetupInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Setup_Already_SetupInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_setup_already_setup(inputs)
	return en_auth_setup_already_setup(inputs)
});