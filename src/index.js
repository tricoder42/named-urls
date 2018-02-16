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
  if (checkEnv) {
    Object.keys(params).forEach( key => {
      if (pattern.indexOf(`:${key}`) < 0) {
        console.warn(`Unknown parameter :${key} in pattern ${pattern}`)
      }
    })
  }
}

export function reverse(pattern, params = {}) {
  checkKeys(pattern, params)
  return (pattern.match(/:\w+\??/g) || []).reduce((url, key) => {
        const optKey = key.replace(':', '').replace('?', '')
        if (params[optKey] === undefined && key.indexOf('?') < 0) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`Required parameter ${key} is missing for ${pattern}`)
          }
          return url
        } else {
          return url.split(key).join(params[optKey] || '')
        }
    }, pattern).replace(/\/\//, '/')
}

export function reverseForce(pattern, params = {}) {
  return (pattern.match(/:\w+\??/g) || []).reduce((url, key) => {
        const optKey = key.replace(':', '').replace('?', '')
        return url.split(key).join(params[optKey] || '')
    }, pattern).replace(/\/\//, '/')
}