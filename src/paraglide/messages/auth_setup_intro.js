/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Setup_IntroInputs */

const fr_auth_setup_intro = /** @type {(inputs: Auth_Setup_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Crée le premier compte administrateur. C'est lui qui pourra ensuite générer des invitations pour les autres utilisateurs.`)
};

const en_auth_setup_intro = /** @type {(inputs: Auth_Setup_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the first administrator account. They will then be able to generate invitations for other users.`)
};

/**
* | output |
* | --- |
* | "Create the first administrator account. They will then be able to generate invitations for other users." |
*
* @param {Auth_Setup_IntroInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const auth_setup_intro = /** @type {((inputs?: Auth_Setup_IntroInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Setup_IntroInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_auth_setup_intro(inputs)
	return en_auth_setup_intro(inputs)
});