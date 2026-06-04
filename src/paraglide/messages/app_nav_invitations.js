/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_Nav_InvitationsInputs */

const fr_app_nav_invitations = /** @type {(inputs: App_Nav_InvitationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invitations`)
};

const en_app_nav_invitations = /** @type {(inputs: App_Nav_InvitationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invitations`)
};

/**
* | output |
* | --- |
* | "Invitations" |
*
* @param {App_Nav_InvitationsInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const app_nav_invitations = /** @type {((inputs?: App_Nav_InvitationsInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_InvitationsInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_app_nav_invitations(inputs)
	return en_app_nav_invitations(inputs)
});