import type { SessionParticipant } from "@core/domain/user-session/entity/types/SessionParticipant";
import type { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";
import mongoose, { Model, Schema, type Document } from "mongoose";

export interface MongooseUserSession extends Document {
  _id: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  learner: SessionParticipant;
  instructor: SessionParticipant;
  createdAt: Date;
  updatedAt: Date;
}

const SessionParticipantSchema = new Schema<SessionParticipant>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: false },
  },
  { _id: false },
);

export const UserSessionSchema = new Schema<MongooseUserSession>(
  {
    _id: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    learner: {
      type: SessionParticipantSchema,
      required: true,
    },
    instructor: {
      type: SessionParticipantSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "user_sessions",
  },
);

export const UserSessionModel: Model<MongooseUserSession> =
  mongoose.model<MongooseUserSession>("UserSession", UserSessionSchema);
