import { addCoreAttrs, zeroCoreAttrs } from './character.derivation';

describe('character.derivation', () => {
  it('addCoreAttrs soma primários', () => {
    const a = { ...zeroCoreAttrs(), strength: 5 };
    const b = { ...zeroCoreAttrs(), vitality: 2, vigorAttribute: 1 };
    expect(addCoreAttrs(a, b)).toEqual({
      strength: 5,
      dexterity: 0,
      intelligence: 0,
      vitality: 2,
      resilience: 0,
      vigorAttribute: 1,
    });
  });
});
