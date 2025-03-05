import userResolvers from './user';
import itemResolvers from './item';
import itemPriceResolvers from './item_price';
import commentResolvers from './comment';
import tagResolvers from './tag';
import { BigIntScalar } from '../scalars';

export default [
  {
    BigInt: BigIntScalar,
  },
  userResolvers,
  itemResolvers,
  itemPriceResolvers,
  commentResolvers,
  tagResolvers,
];
