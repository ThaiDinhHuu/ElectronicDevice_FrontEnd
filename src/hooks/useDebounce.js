
import { useEffect, useState } from "react"

export const useDebounce = (value, delay) => {
      const [valueDebounce, setValueDebounce] = useState('')
      useEffect(() => {
            const handle = setTimeout(() => {
                  setValueDebounce(value)
            }, [delay])
            return () => {
                  clearImmediate(handle)
            }
      }, [value])
      return valueDebounce
}