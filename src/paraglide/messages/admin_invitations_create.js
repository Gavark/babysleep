/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_CreateInputs */

const fr_admin_invitations_create = /** @type {(inputs: Admin_Invitations_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Générer une invitation`)
};

const en_admin_invitations_create = /** @type {(inputs: Admin_Invitations_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Generate an invitation`)
};

/**
* | output |
* | --- |
* | "Generate an invitation" |
*
* @param {Admin_Invitations_CreateInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_create = /** @type {((inputs?: Admin_Invitations_CreateInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_CreateInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_create(inputs)
	return en_admin_invitations_create(inputs)
});