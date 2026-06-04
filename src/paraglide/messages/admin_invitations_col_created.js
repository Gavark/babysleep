/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Admin_Invitations_Col_CreatedInputs */

const fr_admin_invitations_col_created = /** @type {(inputs: Admin_Invitations_Col_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créée`)
};

const en_admin_invitations_col_created = /** @type {(inputs: Admin_Invitations_Col_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Created`)
};

/**
* | output |
* | --- |
* | "Created" |
*
* @param {Admin_Invitations_Col_CreatedInputs} inputs
* @param {{ locale?: "fr" | "en" }} options
* @returns {LocalizedString}
*/
export const admin_invitations_col_created = /** @type {((inputs?: Admin_Invitations_Col_CreatedInputs, options?: { locale?: "fr" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Admin_Invitations_Col_CreatedInputs, { locale?: "fr" | "en" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_admin_invitations_col_created(inputs)
	return en_admin_invitations_col_created(inputs)
});