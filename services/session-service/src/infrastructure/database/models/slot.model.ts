import { model } from 'mongoose';
import { IMongoSlot, SlotSchema } from '../schema/slot.schema';

export const SlotModel = model<IMongoSlot>('Slot', SlotSchema);
