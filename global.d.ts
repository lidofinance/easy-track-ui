// make sure this file is included by your tsconfig.json ("include": ["src/**/*"])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import moment from 'moment'

declare module '*.svg' {
  /**
   * Use `any` to avoid conflicts with
   * `@svgr/webpack` plugin or
   * `babel-plugin-inline-react-svg` plugin.
   */
  const content: any
  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'>
  >
  export default content
}

// declare the plugin module so TS doesn’t complain on import
declare module 'moment-duration-format'

declare module 'moment' {
  interface Duration {
    /**
     * Format a duration like moment-duration-format does
     * @param template e.g. 'h [h] m [min]'
     * @param options trim: 'all'|'left'|'right', minValue, etc.
     */
    format(
      template?: string,
      options?: {
        trim?: 'all' | 'left' | 'right'
        minValue?: number
      },
    ): string
  }
}
