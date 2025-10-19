import React from 'react';
import { FlorenceIcon, CaduceusIcon, CharakaIcon } from '../components/icons/Icons';
import type { AIAgent } from '../types';

export const agents: { [key in AIAgent['id']]: AIAgent } = {
  florence: {
    id: 'florence',
    name: 'Florence',
    role: 'Staffing & Scheduling Expert',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-indigo-600',
    Icon: FlorenceIcon,
  },
  caduceus: {
    id: 'caduceus',
    name: 'Caduceus',
    role: 'Supply Chain Analyst',
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-amber-600',
    Icon: CaduceusIcon,
  },
  charaka: {
    id: 'charaka',
    name: 'Charaka',
    role: 'Public Health Communicator',
    color: 'text-green-400',
    gradient: 'from-green-500 to-teal-600',
    Icon: CharakaIcon,
  },
};
