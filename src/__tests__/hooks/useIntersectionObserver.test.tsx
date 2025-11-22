import { renderHook, waitFor } from "@testing-library/react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

describe("useIntersectionObserver", () => {
  it("returns initial state as not visible", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.isCurrentlyVisible).toBe(false);
  });

  it("returns a ref for the element", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.elementRef).toBeDefined();
    expect(result.current.elementRef.current).toBe(null);
  });

  it("accepts custom threshold option", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ threshold: 0.5 })
    );

    expect(result.current).toBeDefined();
    expect(result.current.isVisible).toBe(false);
  });

  it("accepts custom rootMargin option", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ rootMargin: "50px" })
    );

    expect(result.current).toBeDefined();
    expect(result.current.isVisible).toBe(false);
  });

  it("accepts triggerOnce option", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true })
    );

    expect(result.current).toBeDefined();
    expect(result.current.isVisible).toBe(false);
  });

  it("accepts triggerOnce as false", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: false })
    );

    expect(result.current).toBeDefined();
    expect(result.current.isVisible).toBe(false);
  });

  it("returns all expected properties", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current).toHaveProperty("elementRef");
    expect(result.current).toHaveProperty("isVisible");
    expect(result.current).toHaveProperty("isCurrentlyVisible");
  });

  it("re-renders with different options", () => {
    const { result, rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0.1 } }
    );

    expect(result.current.isVisible).toBe(false);

    rerender({ threshold: 0.5 });

    expect(result.current.isVisible).toBe(false);
  });
});
