
import type { PredictionData, ResourceUtilization, StaffMember, SupplyItem } from '../types';

export const predictionData: PredictionData[] = [
  { day: 'Today', predictedSurge: 68 },
  { day: 'D+1', predictedSurge: 75 },
  { day: 'D+2 (Diwali)', predictedSurge: 95 },
  { day: 'D+3', predictedSurge: 88 },
  { day: 'D+4', predictedSurge: 80 },
  { day: 'D+5', predictedSurge: 72 },
  { day: 'D+6', predictedSurge: 65 },
];

export const resourceUtilization: ResourceUtilization = {
  staff: 75,
  beds: 88,
  ventilators: 60,
};

export const initialStaff: StaffMember[] = [
  { id: 'S001', name: 'Dr. Anjali Rao', specialty: 'Cardiology', status: 'On Duty', shift: 'Morning' },
  { id: 'S002', name: 'Dr. Vikram Singh', specialty: 'Pulmonology', status: 'On Duty', shift: 'Morning' },
  { id: 'S003', name: 'Nurse Priya Sharma', specialty: 'ER', status: 'On Call', shift: 'Evening' },
  { id: 'S004', name: 'Dr. Rohan Mehra', specialty: 'Pediatrics', status: 'Off', shift: 'Night' },
  { id: 'S005', name: 'Nurse Sameer Khan', specialty: 'ICU', status: 'On Duty', shift: 'Evening' },
  { id: 'S006', name: 'Dr. Sunita Desai', specialty: 'General Medicine', status: 'On Call', shift: 'Morning' },
];

export const initialSupplies: SupplyItem[] = [
  { id: 'M01', name: 'Paracetamol', category: 'Medication', stock: 850, capacity: 1000, lowStockThreshold: 200 },
  { id: 'P01', name: 'N95 Masks', category: 'PPE', stock: 1200, capacity: 5000, lowStockThreshold: 1000 },
  { id: 'P02', name: 'Surgical Gloves', category: 'PPE', stock: 4500, capacity: 10000, lowStockThreshold: 2000 },
  { id: 'E01', name: 'Ventilators', category: 'Equipment', stock: 25, capacity: 40, lowStockThreshold: 10 },
  { id: 'M02', name: 'Amoxicillin', category: 'Medication', stock: 180, capacity: 500, lowStockThreshold: 150 },
  { id: 'E02', name: 'Infusion Pumps', category: 'Equipment', stock: 45, capacity: 60, lowStockThreshold: 20 },
];
