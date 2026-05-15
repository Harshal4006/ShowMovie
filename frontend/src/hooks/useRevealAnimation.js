import { useEffect } from "react";

/**
 * Custom hook for managing reveal animations using Intersection Observer
 * This hook sets up observers for elements with [data-reveal] attribute
 * and adds 'is-visible' class when they come into view
 */
const useRevealAnimation = () => {
  useEffect(() => {
    const root = document.documentElement;

    // Fallback for browsers without IntersectionObserver
    if (typeof IntersectionObserver === "undefined") {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    const observed = new WeakSet();

    const primeVisibleElements = () => {
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight || 0;

      document.querySelectorAll("[data-reveal]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isInView = rect.bottom > 0 && rect.top < viewportHeight * 0.98;
        if (isInView) element.classList.add("is-visible");
      });
    };

    const registerRevealElements = () => {
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });
    };

    primeVisibleElements();
    root.classList.add("reveal-enabled");
    registerRevealElements();

    let rafId = 0;
    const mutationObserver = new MutationObserver(() => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        registerRevealElements();
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
      observer.disconnect();
      root.classList.remove("reveal-enabled");
    };
  }, []);
};

export default useRevealAnimation;