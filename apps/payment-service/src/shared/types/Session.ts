export interface Session {
  _class: 'session';
  id: string;
  instructorId: string;
  learnerId: string;
  availabilitySlotId: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  currency: string;
}
