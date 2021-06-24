export const MotionTypes = {
  '0x81C2F1f181496089c4b93a378fe68614F609EB05': 'Test type',
} as const

export type ScriptFactory = keyof typeof MotionTypes

export const parseScriptFactory = (scriptFactory: string) => {
  if (!MotionTypes.hasOwnProperty(scriptFactory)) {
    throw new Error(`Script factory ${scriptFactory} not recognized`)
  }
  return scriptFactory as ScriptFactory
}

export const getMotionType = (scriptFactory: ScriptFactory) =>
  MotionTypes[parseScriptFactory(scriptFactory)]
