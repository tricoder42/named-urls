import { include, reverse } from "."

describe("reverse", function() {
  it("should return original pattern when called without params", function() {
    expect(reverse("pattern")).toEqual("pattern")
    expect(reverse("pattern/:param")).toEqual("pattern/:param")
  })

  it("should replace params", function() {
    expect(reverse("pattern/:param", { param: 42 })).toEqual("pattern/42")
    expect(reverse("a/:param/b/:param", { param: 42 })).toEqual("a/42/b/42")
  })
})

describe("include", function() {
  it("should add prefix to all routes", function() {
    expect(
      include("/base/", {
        first: "first/",
        second: "second/"
      })
    ).toEqual(
      expect.objectContaining({
        first: "/base/first/",
        second: "/base/second/"
      })
    )
  })

  it("should work with nested prefixes", function() {
    expect(
      include("/base/", {
        first: "first/",
        second: include("second", {
          third: "third/",
          fourth: "fourth/"
        })
      })
    ).toEqual(
      expect.objectContaining({
        first: "/base/first/",
        second: expect.objectContaining({
          third: "/base/second/third/",
          fourth: "/base/second/fourth/"
        })
      })
    )
  })

  it("should add missing slash to base", function() {
    expect(
      include("/base", {
        first: "first/",
        second: "second/"
      })
    ).toEqual(
      expect.objectContaining({
        first: "/base/first/",
        second: "/base/second/"
      })
    )
  })

  it("shouldn't prefix base to absolute urls", function() {
    expect(
      include("/base", {
        relative: "rel/",
        absolute: "/abs/"
      })
    ).toEqual(
      expect.objectContaining({
        relative: "/base/rel/",
        absolute: "/abs/"
      })
    )
  })

  it(".toString should return full base path", function() {
    const routes = include("/base/", {
      first: "first/",
      second: include("second", {
        third: "third/",
        fourth: "fourth/"
      })
    })

    expect(routes.second.toString()).toEqual("/base/second")
  })
})
