export function include(base, routes) {
  const mappedRoutes = {}

  Object.keys(routes).forEach(route => {
    const url = routes[route]
    mappedRoutes[route] = url.startsWith("/")
      ? url
      : [base, url].join("/").replace("//", "/")
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
