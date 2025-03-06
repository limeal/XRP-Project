import { BigIntScalar } from '../scalars';
import commentResolvers from './comment';
import itemResolvers from './item';
import itemPriceResolvers from './item_price';
import tagResolvers from './tag';
import userResolvers from './user';

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
