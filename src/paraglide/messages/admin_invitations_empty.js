/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_EmptyInputs */

const fr_admin_invitations_empty = /** @type {(inputs: Admin_Invitations_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune invitation. Génère le premier lien.`)
};

const en_admin_invitations_empty = /** @type {(inputs: Admin_Invitations_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No invitations yet. Generate the first link.`)
};

/**
* | output |
* | --- |
* | "No invitations yet. Generate the first link." |
*
* @param {Admin_Invitations_EmptyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_empty = /** @type {((inputs?: Admin_Invitations_EmptyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_EmptyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_empty(inputs)
	return en_admin_invitations_empty(inputs)
});