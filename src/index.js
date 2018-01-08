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

export function reverse(pattern, params = {}) {
  return Object.keys(params).reduce((url, key) => {
    const newUrl = url.split(`:${key}`).join(params[key])
    if (process.env.NODE_ENV === "development") {
      if (url === newUrl)
        // eslint-disable-next-line no-console
        console.warn(`Unknown parameter :${key} in pattern ${pattern}`)
    }
    return newUrl
  }, pattern)
}
