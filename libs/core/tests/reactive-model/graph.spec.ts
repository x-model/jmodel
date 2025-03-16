import { buildGraph } from '../../src/reactive-model/graph';

// Model example
// export const model = {
//   player1: {
//     currentEquipment: {
//       sword: '',
//       additionalEq: {
//         sword: '',
//       },
//     },
//     bags: [{ sword: '', children: [{ names: '' }] }],
//     score: '',
//   },
//   player2: {
//     currentEquipment: {
//       sword: '',
//     },
//     bags: [{ sword: '' }, { sword: '' }],
//     score: '',
//   },
//   names: ['uno', 'duo'],
// };

// primitive value
// array with objects
// array with primitives ex. [1, 2, 3]
// object
// field
// schema
// object with fields
// object with schemas
// object with primitive arrays
// object with object arrays

describe('graph', () => {
  test('return proper parents, parentsProps (simple model)', () => {
    const model = {
      player1: {
        currentEquipment: {
          sword: '',
        },
        bags: [{ sword: '', children: [{ names: '' }] }],
        score: '',
      },
      player2: {
        currentEquipment: {
          sword: '',
        },
        // bags: [{ sword: "" }, { sword: "" }],
        score: '',
      },
    };

    // parents ids
    // model: 0
    // model.player1 : 1
    // model.player1.currentEquipment: 2
    // model.player1.bags: 3
    // model.player1.bags.children: 4
    // model.player2: 5
    // model.player2.currentEquipment: 6

    // map for prop names
    // combine parents ids with expectedProps
    // 1: 0 means model.player1 => props[0]
    const expectedParentProps = {
      0: undefined,
      1: 0,
      2: 1,
      3: 3,
      4: 4,
      5: 7,
      6: 1,
    };

    // parents
    // 0: undefined
    // 1: 0
    // 2: 1
    // 3: 1
    // 4: 3
    // 5: 0
    // 6: 5
    // index 1 has 0 value, it means that player1 is connected with model model -> player 1
    const expectedParents = [undefined, 0, 1, 1, 3, 0, 5];

    // model 1
    const expectedProps = [
      'player1',
      'currentEquipment',
      'sword',
      'bags',
      'children',
      'names',
      'score',
      'player2',
    ];

    const result = buildGraph(model);
    // const bag = schemaModel.player1.bags[100].children[0];

    expect(result.parentProps).toEqual(expectedParentProps);
    expect(result.parents).toEqual(expectedParents);
    expect([...result.props.values()]).toEqual(expectedProps);
  });

  test('return proper parents, parentsProps', () => {
    const model = {
      player1: {
        currentEquipment: {
          sword: '',
          additionalEq: {
            sword: '',
          },
        },
        bags: [{ sword: '', children: [{ names: '' }] }],
        score: '',
      },
      player2: {
        currentEquipment: {
          sword: '',
        },
        bags: [{ sword: '' }, { sword: '' }],
        score: '',
      },
      names: ['uno', 'duo'],
    };

    // parents ids 2
    // model: 0
    // model.player1 : 1
    // model.player1.currentEquipment: 2
    // model.player1.currentEquipment.additionalEq: 3
    // model.player1.bags: 4
    // model.player1.bags.children: 5
    // model.player2: 6
    // model.player2.currentEquipment: 7
    // model.player2.bags: 8
    // model.names: 9

    // map for prop names
    // combine parents ids with expectedProps
    // 1: 0 means model.player1 => props[0]
    const expectedParentProps = {
      0: undefined,
      1: 0,
      2: 1,
      3: 3,
      4: 4,
      5: 5,
      6: 8,
      7: 1,
      8: 4,
      9: 6,
    };

    // parents
    // 0: undefined
    // 1: 0
    // 2: 1
    // 3: 2
    // 4: 1
    // 5: 4
    // 6: 0
    // 7: 6
    // 8: 6
    // 9: 0
    // index 1 has 0 value, it means that player1 is connected with model model -> player 1
    const expectedParents = [undefined, 0, 1, 2, 1, 4, 0, 6, 6, 0];

    const expectedProps = [
      'player1',
      'currentEquipment',
      'sword',
      'additionalEq',
      'bags',
      'children',
      'names',
      'score',
      'player2',
    ];

    const result = buildGraph(model);
    // const bag = schemaModel.player1.bags[100].children[0];

    expect(result.parentProps).toEqual(expectedParentProps);
    expect(result.parents).toEqual(expectedParents);
    expect([...result.props.values()]).toEqual(expectedProps);
  });
});

// getPath example usage:

// console.log(getPath(model.player1.currentEquipment.sword)); // "player1.currentEquipment.sword"
// console.log(getPath(model.player1.bags[0].sword)); // "player1.bags[0].sword"
// console.log(getPath(model.player1.score)); // "player1.score"
