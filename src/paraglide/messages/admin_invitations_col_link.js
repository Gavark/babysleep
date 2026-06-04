/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_Col_LinkInputs */

const fr_admin_invitations_col_link = /** @type {(inputs: Admin_Invitations_Col_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lien`)
};

const en_admin_invitations_col_link = /** @type {(inputs: Admin_Invitations_Col_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Link`)
};

/**
* | output |
* | --- |
* | "Link" |
*
* @param {Admin_Invitations_Col_LinkInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_col_link = /** @type {((inputs?: Admin_Invitations_Col_LinkInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_Col_LinkInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_col_link(inputs)
	return en_admin_invitations_col_link(inputs)
});