/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_Col_ExpiresInputs */

const fr_admin_invitations_col_expires = /** @type {(inputs: Admin_Invitations_Col_ExpiresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expire`)
};

const en_admin_invitations_col_expires = /** @type {(inputs: Admin_Invitations_Col_ExpiresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expires`)
};

/**
* | output |
* | --- |
* | "Expires" |
*
* @param {Admin_Invitations_Col_ExpiresInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_col_expires = /** @type {((inputs?: Admin_Invitations_Col_ExpiresInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_Col_ExpiresInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_col_expires(inputs)
	return en_admin_invitations_col_expires(inputs)
});