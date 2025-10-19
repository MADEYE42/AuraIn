import React from 'react';

export interface PredictionData {
  day: string;
  predictedSurge: number;
}

export interface ResourceUtilization {
  staff: number;
  beds: number;
  ventilators: number;
}

export type StaffStatus = 'On Duty' | 'On Call' | 'Off';
export type StaffShift = 'Morning' | 'Evening' | 'Night';

export interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  status: StaffStatus;
  shift: StaffShift;
}

export interface SupplyItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  capacity: number;
  lowStockThreshold: number;
}

export interface AIAgent {
    id: 'florence' | 'caduceus' | 'charaka';
    name: string;
    role: string;
    color: string;
    gradient: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface AdvisoryRecord {
  id: string;
  topic: string;
  advisory: string;
  timestamp: string;
}