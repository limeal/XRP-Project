import { GraphQLScalarType, Kind } from 'graphql';

export const BigIntScalar = new GraphQLScalarType({
  name: 'BigInt',
  description: 'BigInt custom scalar type',

  serialize(value) {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    // Pour les valeurs déjà sous forme de string
    return value;
  },

  parseValue(value: unknown) {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'bigint'
    ) {
      return BigInt(value);
    }
    throw new Error('Invalid input type for BigInt');
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return BigInt(ast.value);
    }
    return null;
  },
});
