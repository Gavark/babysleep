/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_ForbiddenInputs */

const fr_admin_invitations_forbidden = /** @type {(inputs: Admin_Invitations_ForbiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réservé aux administrateurs`)
};

const en_admin_invitations_forbidden = /** @type {(inputs: Admin_Invitations_ForbiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Administrators only`)
};

/**
* | output |
* | --- |
* | "Administrators only" |
*
* @param {Admin_Invitations_ForbiddenInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_forbidden = /** @type {((inputs?: Admin_Invitations_ForbiddenInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_ForbiddenInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_forbidden(inputs)
	return en_admin_invitations_forbidden(inputs)
});