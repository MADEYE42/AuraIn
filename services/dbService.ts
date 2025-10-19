import type { StaffMember, SupplyItem, AdvisoryRecord } from '../types';
import { initialStaff, initialSupplies } from '../data/mockData';

const DB_KEY = 'aura_hospital_db';

interface AppDB {
  staff: StaffMember[];
  supplies: SupplyItem[];
  advisoryHistory: AdvisoryRecord[];
}

const getDB = (): AppDB => {
  try {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
      const parsed = JSON.parse(dbString);
      // Ensure all keys exist
      return {
        staff: parsed.staff || initialStaff,
        supplies: parsed.supplies || initialSupplies,
        advisoryHistory: parsed.advisoryHistory || [],
      };
    }
  } catch (error) {
    console.error("Failed to parse DB from localStorage", error);
  }
  // Return initial data if DB doesn't exist or is corrupt
  return { staff: initialStaff, supplies: initialSupplies, advisoryHistory: [] };
};

const saveDB = (db: AppDB): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Failed to save DB to localStorage", error);
  }
};

export const initializeDB = (): void => {
  const dbString = localStorage.getItem(DB_KEY);
  if (!dbString) {
    saveDB({ staff: initialStaff, supplies: initialSupplies, advisoryHistory: [] });
  }
};

// --- Staff ---

export const getStaff = async (): Promise<StaffMember[]> => {
  // Simulate async operation
  return Promise.resolve(getDB().staff);
};

export const updateStaffMember = async (updatedMember: StaffMember): Promise<void> => {
  const db = getDB();
  const newStaff = db.staff.map(member =>
    member.id === updatedMember.id ? updatedMember : member
  );
  saveDB({ ...db, staff: newStaff });
  return Promise.resolve();
};

// --- Supplies ---

export const getSupplies = async (): Promise<SupplyItem[]> => {
  // Simulate async operation
  return Promise.resolve(getDB().supplies);
};

export const updateSupplyItem = async (updatedItem: SupplyItem): Promise<void> => {
  const db = getDB();
  const newSupplies = db.supplies.map(item =>
    item.id === updatedItem.id ? updatedItem : item
  );
  saveDB({ ...db, supplies: newSupplies });
  return Promise.resolve();
};

// --- Advisory History ---

export const getAdvisoryHistory = async (): Promise<AdvisoryRecord[]> => {
    return Promise.resolve(getDB().advisoryHistory);
};

export const addAdvisoryRecord = async (record: AdvisoryRecord): Promise<void> => {
    const db = getDB();
    // Add new record to the beginning of the array
    const newHistory = [record, ...db.advisoryHistory];
    saveDB({ ...db, advisoryHistory: newHistory });
    return Promise.resolve();
};