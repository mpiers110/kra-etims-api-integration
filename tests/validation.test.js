const { ValidationError } = require('../dist/src/utils/errors');
const { schemas, validate } = require('../dist/src/utils/validation');

describe('request validation', () => {
  test('strips unknown properties while preserving valid fields', () => {
    const input = {
      tin: 'P000000045R',
      bhfId: '00',
      lastReqDt: '20220101010101',
      unexpected: 'discard me'
    };

    expect(validate(input, schemas.moveList)).toEqual({
      tin: 'P000000045R',
      bhfId: '00',
      lastReqDt: '20220101010101'
    });
  });

  test('reports all missing fields for a list request', () => {
    try {
      validate({}, schemas.moveList);
      throw new Error('Expected request validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'tin' }),
          expect.objectContaining({ field: 'bhfId' }),
          expect.objectContaining({ field: 'lastReqDt' })
        ])
      );
    }
  });

  test('reports the path of a missing nested sales item field', () => {
    try {
      validate(
        {
          tin: 'P000000045R',
          bhfId: '00',
          invcNo: 'INV001',
          salesTrnsItems: [{ itemCd: 'ITEM001' }]
        },
        schemas.salesTrns
      );
      throw new Error('Expected nested sales validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'salesTrnsItems.0.itemNm' })
        ])
      );
    }
  });
});
