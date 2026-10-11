// Snacks API.
// Serves the bundled catalog for now. Swap these for network calls when the
// catalog moves to a backend.
import snackPackData from '../data/snackPackData';
import { SNACKS } from '../logic/customBox';

export const CATEGORIES = ['Kids', 'Teens/Adults', 'Elite Athletes'];

export async function fetchSnackPacks() {
  return snackPackData;
}

export async function fetchSnackPack(id) {
  return snackPackData.find((pack) => pack.id === String(id)) || null;
}

export async function fetchSingleSnacks() {
  return SNACKS;
}
