/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_Col_StatusInputs */

const fr_admin_invitations_col_status = /** @type {(inputs: Admin_Invitations_Col_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Statut`)
};

const en_admin_invitations_col_status = /** @type {(inputs: Admin_Invitations_Col_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

/**
* | output |
* | --- |
* | "Status" |
*
* @param {Admin_Invitations_Col_StatusInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_col_status = /** @type {((inputs?: Admin_Invitations_Col_StatusInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_Col_StatusInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_col_status(inputs)
	return en_admin_invitations_col_status(inputs)
});