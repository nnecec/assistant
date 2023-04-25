import { useMemo, useState } from 'react'
import { useMemoizedFn } from '@afojs/react-utils'
import { createLocationStorage, remember } from '@afojs/remember'

import type React from 'react'

import type { Params, RegisterOptions, Search } from './types'

const defaultGetValue = (e: unknown) => {
  if (
    e !== null &&
    typeof e === 'object' &&
    'target' in e &&
    (e as React.ChangeEvent<HTMLInputElement>).target.value
  ) {
    return (e as React.ChangeEvent<HTMLInputElement>).target.value
  }
  return e
}

export const useSearch = (scope = 'afo-search'): Search => {
  const reme = useMemo(() => {
    if (typeof document !== 'undefined') {
      return remember(scope, { storage: createLocationStorage() })
    }
    return remember(scope)
  }, [scope])

  const [params, setParams] = useState<Params>(reme.get() as Params ?? {})

  const register = useMemoizedFn((name: string, options: RegisterOptions = {}) => {
    const { trigger = 'onChange', getValue, valuePropName = 'value' } = options

    return {
      [valuePropName]: params[name] || undefined,
      [trigger]: (e: unknown) => {
        const value = typeof getValue === 'function' ? getValue(e) : defaultGetValue(e)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [name]: dropParam, ...restParams } = params
        // remove nullish key
        const nextParams =
          value === null || value === undefined || value === ''
            ? restParams
            : { ...restParams, [name]: value }

        setParams(nextParams)
        reme.set(nextParams)
      },
    }
  })

  return [params, register]
}