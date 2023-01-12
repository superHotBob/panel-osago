import {CRM_DATA_LINKS} from "../constants/crmDataAggregatorLinks";

export default function createCrmDataAggregator(initialData = {}) {
  let state = fillScheme(initialData)

  return function (data = {}) {
    if (!Object.keys(data).length) {
      return state
    }

    state = Object.assign(state, fillScheme(data))

    return state
  }
}

function fillScheme(data = {}) {
  const scheme = {}
  
  Object.keys(CRM_DATA_LINKS).map((schemeKey) => {
    for (let i = 0; i < CRM_DATA_LINKS[schemeKey].length; i++) {
      const value = iterate(data, CRM_DATA_LINKS[schemeKey][i])

      if (value) {
        scheme[schemeKey] = value
        break
      }
    }
  })

  return scheme
}

function iterate(obj, key) {
  const keyArr = key.split('.')
  let stack, res

  for (let i = 0; i < keyArr.length; i++) {
    const cur = stack ? stack[keyArr[i]] : obj[keyArr[i]]

    if (cur && typeof cur === 'object' && !Array.isArray(cur)) {
      stack = cur
    } else {
      res = (i === keyArr.length - 1) ? cur : undefined
    }
  }

  return res
}
