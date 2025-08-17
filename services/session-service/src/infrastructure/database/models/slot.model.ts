import { model } from 'mongoose';
import { type IMongoSlot, SlotSchema } from '../schema/slot.schema';

export const SlotModel = model<IMongoSlot>('Slot', SlotSchema);
