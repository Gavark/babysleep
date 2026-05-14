/**
 * 🍼 Calculateur de sommeil bébé — Apps Script
 * ---------------------------------------------------------------
 * MODE D'EMPLOI (à faire une seule fois)
 *
 * 1. Dans Google Sheets, ouvrir Extensions → Apps Script.
 * 2. Coller TOUT ce fichier dans Code.gs (remplacer le contenu existant) → Enregistrer.
 * 3. Revenir sur la feuille "Calculateur", sélectionner la cellule B30, puis Insertion
 *    → Case à cocher. La cellule doit afficher une vraie case (pas le mot "FAUX").
 * 4. Tester : remplir B17 (réveil) et cocher B30. La journée doit partir dans l'Historique
 *    et la case se décocher toute seule.
 *
 * Compatible mobile : l'app Google Sheets Android/iOS exécute onEdit, donc cocher la
 * case depuis le téléphone déclenche bien l'enregistrement.
 *
 * Limites mobile : onEdit "simple" n'a pas accès à ui.alert/ui.prompt. On utilise
 * uniquement spreadsheet.toast() pour le retour utilisateur.
 * ---------------------------------------------------------------
 */

// ----- Constantes (à ajuster si tu déplaces des cellules) -----
const CONFIG = {
  SHEET_CALC: 'Calculateur',
  SHEET_HIST: 'Historique',

  // Cellule case à cocher qui déclenche l'enregistrement
  CELL_TRIGGER: 'B30',

  // Saisies du jour côté Calculateur
  CELL_WAKE: 'B17',                                  // Réveil ce matin
  CELLS_NAPS: ['B19', 'B21', 'B23', 'B25'],          // Fins de siestes 1 à 4
  CELL_BEDTIME_ACTUAL: 'B28',                        // Coucher effectif (saisie)
  CELL_BEDTIME_SUGGESTED: 'B27',                     // Coucher suggéré (calculé)

  // Cellules à vider après enregistrement (on garde B17 = réveil, B5 = âge, B6 = réveil souhaité)
  CELLS_TO_CLEAR: ['B19', 'B21', 'B23', 'B25', 'B28'],

  // Plage de l'historique (colonne A = Date)
  HIST_FIRST_ROW: 11,
  HIST_LAST_ROW: 110,
  HIST_DATE_COL: 1,  // A
};

/**
 * Déclencheur simple : se lance à chaque édition de la feuille.
 * Filtre sur Calculateur!B30 passé à TRUE.
 */
function onEdit(e) {
  if (!e || !e.range) return;

  const sheet = e.range.getSheet();
  if (sheet.getName() !== CONFIG.SHEET_CALC) return;
  if (e.range.getA1Notation() !== CONFIG.CELL_TRIGGER) return;

  // On ne réagit qu'au passage à TRUE (cochage). Le décochage final fait par le script
  // re-déclenche onEdit avec e.value === 'FALSE' → on ignore.
  if (e.value !== 'TRUE' && e.value !== true) return;

  enregistrerJournee_(sheet);
}

/**
 * Logique d'enregistrement. Séparée d'onEdit pour pouvoir la tester manuellement
 * depuis l'éditeur de scripts (clic sur "Exécuter" → enregistrerJournee).
 */
function enregistrerJournee_(calcSheet) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!calcSheet) calcSheet = ss.getSheetByName(CONFIG.SHEET_CALC);
  if (!calcSheet) {
    ss.toast('Feuille "' + CONFIG.SHEET_CALC + '" introuvable.', '❌ Erreur', 6);
    return;
  }

  const histSheet = ss.getSheetByName(CONFIG.SHEET_HIST);
  if (!histSheet) {
    ss.toast('Feuille "' + CONFIG.SHEET_HIST + '" introuvable.', '❌ Erreur', 6);
    decocher_(calcSheet);
    return;
  }

  // Garde-fou : réveil obligatoire
  const wake = calcSheet.getRange(CONFIG.CELL_WAKE).getValue();
  if (wake === '' || wake === null) {
    ss.toast('Renseigne d\'abord l\'heure de réveil (B17).', '⚠️ Manque le réveil', 6);
    decocher_(calcSheet);
    return;
  }

  // Saisies du jour
  const naps = CONFIG.CELLS_NAPS.map(function (a1) {
    return calcSheet.getRange(a1).getValue();
  });

  // Coucher : valeur effective si renseignée, sinon le suggéré
  let bedtime = calcSheet.getRange(CONFIG.CELL_BEDTIME_ACTUAL).getValue();
  if (bedtime === '' || bedtime === null) {
    bedtime = calcSheet.getRange(CONFIG.CELL_BEDTIME_SUGGESTED).getValue();
  }

  // Date du jour (à minuit, pour comparaison stricte de dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Cherche la ligne cible : (1) ligne du jour si existe, (2) sinon première vide
  const dateValues = histSheet
    .getRange(CONFIG.HIST_FIRST_ROW, CONFIG.HIST_DATE_COL,
              CONFIG.HIST_LAST_ROW - CONFIG.HIST_FIRST_ROW + 1, 1)
    .getValues();

  let targetIdx = -1;
  let firstEmptyIdx = -1;
  for (let i = 0; i < dateValues.length; i++) {
    const v = dateValues[i][0];
    if (v instanceof Date) {
      const d = new Date(v.getTime());
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === today.getTime()) {
        targetIdx = i;
        break;
      }
    } else if ((v === '' || v === null) && firstEmptyIdx === -1) {
      firstEmptyIdx = i;
    }
  }

  let isUpdate = true;
  if (targetIdx === -1) {
    if (firstEmptyIdx === -1) {
      ss.toast('Historique plein (' + CONFIG.HIST_LAST_ROW + ' lignes). ' +
               'Étends la plage dans le script.', '⚠️ Historique plein', 8);
      decocher_(calcSheet);
      return;
    }
    targetIdx = firstEmptyIdx;
    isUpdate = false;
  }

  const targetRow = CONFIG.HIST_FIRST_ROW + targetIdx;

  // Écriture colonnes A..G
  histSheet.getRange(targetRow, 1).setValue(today);
  histSheet.getRange(targetRow, 2).setValue(wake);
  for (let i = 0; i < 4; i++) {
    const v = naps[i];
    const cell = histSheet.getRange(targetRow, 3 + i);
    if (v === '' || v === null) {
      cell.clearContent();
    } else {
      cell.setValue(v);
    }
  }
  const couchCell = histSheet.getRange(targetRow, 7);
  if (bedtime === '' || bedtime === null) {
    couchCell.clearContent();
  } else {
    couchCell.setValue(bedtime);
  }

  // Vide les saisies du jour côté Calculateur (on garde réveil, âge, réveil souhaité)
  CONFIG.CELLS_TO_CLEAR.forEach(function (a1) {
    calcSheet.getRange(a1).clearContent();
  });

  // Décoche la case
  decocher_(calcSheet);

  const action = isUpdate ? 'mise à jour' : 'ajoutée';
  ss.toast('Ligne ' + targetRow + ' ' + action + ' dans l\'Historique.',
           '✅ Journée enregistrée', 5);
}

function decocher_(calcSheet) {
  try {
    calcSheet.getRange(CONFIG.CELL_TRIGGER).setValue(false);
  } catch (err) {
    // ignore — la case sera décochée à la prochaine édition manuelle
  }
}
