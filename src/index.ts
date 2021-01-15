import { compile, parse } from "path-to-regexp"

// ===================================================
// TYPES
// ===================================================
export interface Include {
  <R extends Routes>(path: string, routes: R): R & { toString(): string }
}

export interface Reverse {
  (pattern: string, params?: ReverseParams): string
}

export interface ReverseParams {
  [path: string]: number | string
}

export interface Routes {
  [path: string]: string | Routes | (() => string)
}

export type ReverseForce = Reverse

// ===================================================
// IMPLEMENTATION
// ===================================================
export const include: Include = (base, routes) => {
  const mappedRoutes: Routes = {
    toString() {
      return base
    },
  }

  Object.keys(routes).forEach((route) => {
    const url = routes[route]

    if (typeof url === "function" && route === "toString") {
      mappedRoutes.toString = function () {
        return base + routes.toString()
      }
    } else if (typeof url === "object") {
      // nested include - prefix all sub-routes with base
      mappedRoutes[route] = include(base, url)
    } else if (typeof url === "string") {
      // route - prefix with base and replace duplicate //
      mappedRoutes[route] =
        url.indexOf("/") === 0 ? url : [base, url].join("/").replace("//", "/")
    } else {
      // don't allow invalid routes object
      throw new TypeError(
        `"${route}" is not valid. A routes object can only contain a string, an object or the "toString" method as values.`
      )
    }
  })

  return mappedRoutes as typeof routes
}

function compileWithParams<P extends ReverseParams>(
  pattern: string,
  params: P
) {
  const reversed = compile<P>(pattern)

  return reversed(params)
}

export const reverse: Reverse = (pattern, params = {}) => {
  try {
    return compileWithParams(pattern, params)
  } catch (err) {
    return pattern
  }
}

export const reverseForce: ReverseForce = (pattern, params = {}) => {
  try {
    return compileWithParams(pattern, params)
  } catch (err) {
    const tokens = parse(pattern)

    return tokens.filter((token) => typeof token === "string").join("")
  }
}
