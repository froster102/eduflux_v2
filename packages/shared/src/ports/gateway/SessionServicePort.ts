export interface Session {
  id: string;
  instructorId: string;
  learnerId: string;
  availabilitySlotId: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentId: string;
  currency: string;
  price: number;
  pendingPaymentExpiryTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookSessionRequest {
  slotId: string;
  userId: string;
}

export interface BookSessionResponse {
  id: string;
}

export interface SessionServicePort {
  getSession(sessionId: string): Promise<Session>;
  bookSession(request: BookSessionRequest): Promise<BookSessionResponse>;
}
