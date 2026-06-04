/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Setup_TitleInputs */

const fr_auth_setup_title = /** @type {(inputs: Auth_Setup_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bienvenue sur BabySleep`)
};

const en_auth_setup_title = /** @type {(inputs: Auth_Setup_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Welcome to BabySleep`)
};

/**
* | output |
* | --- |
* | "Welcome to BabySleep" |
*
* @param {Auth_Setup_TitleInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_setup_title = /** @type {((inputs?: Auth_Setup_TitleInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Setup_TitleInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_setup_title(inputs)
	return en_auth_setup_title(inputs)
});