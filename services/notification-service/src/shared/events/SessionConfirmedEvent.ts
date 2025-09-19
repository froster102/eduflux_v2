export type SessionEvent = {
  type: "session.confirmed";
  correlationId: "";
  data: {
    sessionId: string;
    learnerId: string;
    instructorId: string;
    startTime: string;
    endTime: string;
    path: string;
  };
};
