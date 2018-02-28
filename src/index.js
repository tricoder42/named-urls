const checkEnv = process.env.NODE_ENV === "development"

export function include(base, routes) {
  const mappedRoutes = {
    toString() {
      return base
    }
  }

  Object.keys(routes).forEach(route => {
    const url = routes[route]

    if (typeof url === "function" && route === "toString") {
      mappedRoutes.toString = function() {
        return base + routes.toString()
      }
    } else if (typeof url === "object") {
      // nested include - prefix all sub-routes with base
      mappedRoutes[route] = include(base, url)
    } else {
      // route - prefix with base and replace duplicate //
      mappedRoutes[route] =
        url.indexOf("/") === 0 ? url : [base, url].join("/").replace("//", "/")
    }
  })

  return mappedRoutes
}

const checkKeys = (pattern, params) => {
  Object.keys(params).forEach(key => {
    if (pattern.indexOf(`:${key}`) < 0) {
      console.warn(`Unknown parameter :${key} in pattern ${pattern}`)
    }
  })
}

function preserveEndingSlash(pattern, reversed) {
  const endingSlashRe = /\/$/

  const shouldHave = endingSlashRe.test(pattern)
  const has = endingSlashRe.test(reversed)

  if (shouldHave && !has) {
    return reversed + "/"
  } else if (!shouldHave && has) {
    return reversed.slice(0, reversed.length - 1)
  }

  return reversed
}

export function reverse(pattern, params = {}) {
  if (checkEnv) {
    checkKeys(pattern, params)
  }
  const reversed = (pattern.match(/:\w+\??/g) || [])
    .reduce((url, key) => {
      const optKey = key.replace(":", "").replace("?", "")
      if (params[optKey] === undefined && key.indexOf("?") < 0) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`Required parameter ${key} is missing for ${pattern}`)
        }
        return url
      } else {
        return url.split(key).join(params[optKey] || "")
      }
    }, pattern)
    .replace(/\/\//, "/")
  return preserveEndingSlash(pattern, reversed)
}

export function reverseForce(pattern, params = {}) {
  const reversed = (pattern.match(/:\w+\??/g) || [])
    .reduce((url, key) => {
      const optKey = key.replace(":", "").replace("?", "")
      return url.split(key).join(params[optKey] || "")
    }, pattern)
    .replace(/\/\//g, "/")
  return preserveEndingSlash(pattern, reversed)
}
