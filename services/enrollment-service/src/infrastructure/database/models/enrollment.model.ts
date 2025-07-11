import mongoose, { Model } from 'mongoose';
import { EnrollmentSchema, IEnrollment } from '../schema/enrollment.schema';

const EnrollmentModel: Model<IEnrollment> = mongoose.model<IEnrollment>(
  'Enrollment',
  EnrollmentSchema,
);

export default EnrollmentModel;
