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
    ).toEqual({
      first: "/base/first/",
      second: "/base/second/"
    })
  })

  it("should add missing slash to base", function() {
    expect(
      include("/base", {
        first: "first/",
        second: "second/"
      })
    ).toEqual({
      first: "/base/first/",
      second: "/base/second/"
    })
  })

  it("shouldn't prefix base to absolute urls", function() {
    expect(
      include("/base", {
        relative: "rel/",
        absolute: "/abs/"
      })
    ).toEqual({
      relative: "/base/rel/",
      absolute: "/abs/"
    })
  })
})
