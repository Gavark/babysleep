/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_CopyInputs */

const fr_admin_invitations_copy = /** @type {(inputs: Admin_Invitations_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier`)
};

const en_admin_invitations_copy = /** @type {(inputs: Admin_Invitations_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy`)
};

/**
* | output |
* | --- |
* | "Copy" |
*
* @param {Admin_Invitations_CopyInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_copy = /** @type {((inputs?: Admin_Invitations_CopyInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_CopyInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_copy(inputs)
	return en_admin_invitations_copy(inputs)
});