import { CHAINS } from '@lido-sdk/constants'

/*
  nodeOperatorId -> managerAddress
  The reason this map is here is because the manager address is not stored in the
  any of the contracts, but is instead only fired in the events.
  Since there might be some issues loading all the addresses from the logs,
  we are storing them here.
  On each address change, the map should be updated.
*/
export const MANAGER_ADDRESS_MAP: Partial<
  Record<CHAINS, Record<number, string | undefined>>
> = {
  [CHAINS.Mainnet]: {
    0: '0x83d3dcee0289ce96af4051ab50f01e5e8ce7677c',
    1: '0x94890c2e0e98f149985f0444f01b36d1d37cb182',
    2: '0x8c1699304f4eac58077b1648e5b80bd0b41ec9f1',
    3: '0x63e8a52995eddce799de72163cdf688f1b16f347',
    4: '0xd058aff17a61e51404d205a84c6b5f73f0788e4b',
    5: '0x64397e9db5d9f0ba15c58dd377fc258b4505e7d9',
    6: '0x0606c73f51cae370f11085e19506d59a8c86f889',
    7: '0xa9c48f5b6227ee15842dd24e0e3128fca28aa65c',
    8: '0x35e3c61c3d7f1786c1c12dbde2ac7b7e204f5034',
    9: '0x92f0339f592c58d3881789e3e2aef6861cf022b2',
    10: '0x2a0d2ed8a47d818bd430a355c4090cab9eedf8b1',
    11: '0xbe511fa89011fc8c90259c5d1faff9f8fd92c3ef',
    12: '0x3b3bca3d0296f3e3a2a10197bdb8515ddf59f2eb',
    13: '0xc4c04add0fe21ecc4f186893bfc714da0cfd5ac3',
    14: '0x9ea5c73eef6fe5b1df238930c5a3b8dd82ff1422',
    15: '0x1ddb4e46810806b5fbf67ac69b84ca48b8cbed1f',
    16: '0x1c4eda5e2be9055126b9833db4ea99a30822f751',
    17: '0x75f9af7483ef01635a6b80ec1b1f51c2024e22c8',
    18: '0x1d9903f7b14f6e12a278bb2e83f51bd9429ab482',
    19: '0xe468a9e3d1fc6983d6aea9266d99a5daeebac58a',
    20: '0xf97365034279d638d0094edc638075096bcbf373',
    21: '0x2cb72bc8176e6056f5090bdf5f6497acab327a5f',
    22: '0x0bacb8024f58add1b22641a791d47aa9eb752acf',
    23: '0x5ed21077adef79628516b7628839c0cd2b44ca5f',
    24: '0x80dee92dd859deac0dc580eea86b40917354bcbc',
    25: '0xdbfd08b7b1e6dbb057fce140b74a06351c4a157d',
    26: '0x1e938e83e8b3daa03a4bd0298cec8ecfb534975f',
    27: '0xfb668d6c258e37267c124130c77d824471f84dbc',
    28: '0x6519da1bb0a4be96fec435a482a221cc7e4952a1',
    29: '0x8167fa100d768eeaec642279603a40054f26ce29',
    30: '0x871872c461bceffabc527d73d279c33c05a4e73f',
    31: '0xaf72da734303c8187ecf3701d74255c481a48593',
    32: '0x2e990b8dbc3abc4539b848fec9b5151041650e84',
    33: '0x6fed41080283a4ea4b238f3b2b8aa5db28af8d49',
    34: '0xde388e04f893afd12bda0f80b0c750e6d9f7a47d',
    35: '0x257a6f40e7e93461d249096fa9cfcd117d505707',
    36: '0xb2530002565f2b9e598657b18b752c03217662ca',
    37: '0x8b37b36adeb7e3e69a17b93f6af3da1823655ba0',
    38: '0xc9adc7184c2817b084fbd768f0073c6e4eb8db63',
    39: '0x88fd4d0f2342b079a3ef2b709b567e4cfe4c143d',
    40: '0x29fc7a8768949a2a9130fa7500512de14112d337',
    41: '0xbe8d0149f8ab1bdf394379ae0add6a9103633fbe',
    42: '0x4c3d31ab3c7e31fbaab548b6f3adf46fecf59895',
    43: '0x8b87d5d4ccabc26a99d44bec19c5f25f0a0d6019',
    44: '0x8682982ad244efc789dc60eeb6a4823fd883319a',
    45: '0x36c930feceb25dc4418438d171c4a4dbf6712896',
    46: '0x7bf6945430017aefea7dd0cd450382aae01220f5',
    47: '0x5fae2734cd11029d8bccbcdc3752bf0299c0934c',
    48: '0x4c46fecc566a196cd3196d19899d9a9d73df5b56',
    49: '0xc8d12601f8680ef2408dd4fd17c008817dbc36e0',
    50: '0x306b5c7475b97bf6df43dfed00a268e5ddcae75e',
    51: '0xca787cdb322df3ad5b9e230baba8346f1bf8fe8b',
    52: '0x37ed9424465f9ff2f6a012e688de8735cb9e2afb',
    53: '0xfc23dd69b6968c8623db910984886c94cc2236aa',
    54: '0x6706a45d13685950308eff93b45d1a4ebb054f84',
    55: '0x2ec75fd873860151eeeec4da50e9594bd168ef98',
    56: '0x6e809aadf0e4686322d53c611e9facf9cfb0f636',
    57: '0x7f34d125aec27cb22f923b2354c4114341047dc0',
    58: '0x49cbee5e1b9857b82e01af0755ee563f3b190769',
    59: '0x5987a1fdf5d7c24ba7074ef9dc5fb36a1f0acd44',
    60: '0x12e804caf53dbb9ee1db85ad8483deaad5dd457d',
    61: '0x512489b537c38e04f231e797ba9f76d5108bfd48',
    62: '0x560630a67307593d0c55e2a0284eb14e0a00d77d',
    63: '0x70003fd8d8c405f767a49336c349777a66497d01',
    64: '0x88676deac738ad9397c305ffc5abad2e9952fd93',
    65: '0xa9fedcaec979d6e6b20d026b3790115970b66412',
    66: '0x585c0b0b9e0f3f649c6c7e4dcf4d44ba348c018a',
    67: '0xb962865acc35256db89edf5c25da1988326f939d',
    68: '0xc407e117738f1f7002105262e4e625cb8ba6e1da',
    69: '0xb39b6ab2d93328a96efeea19175d95d833ba378d',
    70: '0x3aead7ef230851487173f944a4fa1a7b4ec6da7f',
    71: '0xc1659aaad93c1dcc4cc62d5d0c9f0e0da6229536',
    72: '0xf2415cdb4a4a45af77d7dd77154a245f37cdc449',
    73: '0xaf1bec9b5a0a35199529e8b8e7bc5b74c9bfd252',
    74: '0x1d3f689dea4105029ebb8e8f6cad3a6efbf43fd0',
    75: '0xec730ca6e0555626bfc641c8465d2b5335f41c89',
    76: '0x45345ea372e3da5753684b546682ba035a3f7cec',
    77: '0x553bcf02058310ef1ac91a1588ea114c436eafaa',
    78: '0x57cea99437a5e01eabb137134f1ced8bdba974f8',
    79: '0xd30ebe002f4e8d27b4121a9229fdbc9d069aad86',
    80: '0x7c4e5fcd974702c7a4f23f9782dbd80a63638216',
    81: '0xdd10e17afa24bd6ed9cf8650c631c5df8e7fa290',
  },
  /*
    24.06.2025: all 4 clusters on Hoodi were added without manager addresses.
    The addresses might be added later.
  */
  [CHAINS.Hoodi]: {},
  // Deprecated chain
  [CHAINS.Holesky]: {},
}

export const getSDVTOperatorManagerAddress = (
  chainId: CHAINS,
  nodeOperatorId: number,
): string | undefined => {
  return MANAGER_ADDRESS_MAP[chainId]?.[nodeOperatorId]
}
