import { expect, mock, spyOn, test } from "bun:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import {
  AuthContext,
  type AuthContextValue,
} from "@/context/auth-context-shared";
import { LandingPage } from "./LandingPage";

// SAFETY: LandingPage only reads isAuthenticated from this context.
const guest = { isAuthenticated: false } as AuthContextValue;

async function mountLanding() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(
      <MemoryRouter>
        <AuthContext.Provider value={guest}>
          <LandingPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });

  return { container, root };
}

test("guests can switch team members and see industry designs directly", async () => {
  const { container, root } = await mountLanding();

  try {
    expect(container.querySelectorAll("main > section")).toHaveLength(10);
    expect(
      container.querySelectorAll("#ai-team .landing-roster-grid > li")
    ).toHaveLength(8);
    expect(
      container.querySelectorAll("#agent-groups .landing-group-message")
    ).toHaveLength(3);
    expect(container.querySelector('a[href="/login"]')).not.toBeNull();
    expect(container.querySelector('a[href="#daftar-tunggu"]')).not.toBeNull();
    expect(
      Array.from(
        container.querySelectorAll<HTMLInputElement>(
          "#daftar-tunggu input[required]"
        ),
        (input) => input.name
      )
    ).toEqual([
      "contactName",
      "businessName",
      "businessType",
      "whatsapp",
      "email",
    ]);
    expect(
      container.querySelectorAll(".landing-app-rows .landing-marquee")
    ).toHaveLength(2);
    expect(container.querySelector(".landing-marquee-control")).toBeNull();
    expect(container.querySelector(".landing-example-switch")).toBeNull();

    const members = container.querySelectorAll<HTMLButtonElement>(
      ".landing-team-picker button"
    );

    expect(members).toHaveLength(3);

    for (const [index, avatar] of ["hana", "dimas", "kezia"].entries()) {
      await act(async () => members[index]?.click());
      expect(members[index]?.getAttribute("aria-pressed")).toBe("true");
      expect(
        container
          .querySelector(".landing-workspace-scene")
          ?.getAttribute("data-agent")
      ).toBe(avatar);
      expect(
        container
          .querySelector(".landing-title-avatar img")
          ?.getAttribute("src")
      ).toBe(`/characters/${avatar}.png`);
      expect(
        container.querySelectorAll(".landing-active-agent > img")
      ).toHaveLength(1);
      expect(
        container
          .querySelector(".landing-active-agent > img")
          ?.getAttribute("src")
      ).toBe(`/characters/${avatar}.png`);
      expect(container.querySelectorAll(".landing-task-output")).toHaveLength(
        1
      );
    }

    const industries = container.querySelectorAll<HTMLButtonElement>(
      ".landing-industry-switch button"
    );

    expect(industries).toHaveLength(4);

    for (const [index, industry] of [
      "laundry",
      "carwash",
      "restaurant",
      "retail",
    ].entries()) {
      await act(async () => industries[index]?.click());
      expect(industries[index]?.getAttribute("aria-pressed")).toBe("true");
      expect(
        container.querySelector(`#use-cases .landing-poster-${industry}`)
      ).not.toBeNull();
      expect(
        container
          .querySelector("#use-cases .landing-poster-photo img")
          ?.getAttribute("src")
      ).toBe(`/landing/${industry}.webp`);
    }

    // No observer exists in this test environment; content still renders normally.
    expect(container.querySelector("#fitur")?.hasAttribute("hidden")).toBe(
      false
    );
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});

test("team rotation follows reduced motion and clears its timer", async () => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const matchMedia = spyOn(window, "matchMedia").mockReturnValue(preference);
  const callbacks = new Map<number, () => void>();
  let timerId = 0;

  // Use the browser overload; Bun also declares Node timer handles on Window.
  const timers: {
    setInterval: (handler: TimerHandler, timeout?: number) => number;
    clearInterval: (id?: number) => void;
  } = window;

  const setInterval = spyOn(timers, "setInterval").mockImplementation(
    (callback) => {
      // SAFETY: The workbench passes a zero-argument function to setInterval.
      callbacks.set(++timerId, callback as () => void);

      return timerId;
    }
  );

  const clearInterval = spyOn(timers, "clearInterval").mockImplementation(
    (id) => {
      if (id !== undefined) {
        callbacks.delete(id);
      }
    }
  );

  const { container, root } = await mountLanding();
  let unmounted = false;

  try {
    expect(callbacks.size).toBe(1);

    const tick = async () => {
      await act(async () => {
        for (const callback of callbacks.values()) {
          callback();
        }
      });

      const avatar = container
        .querySelector(".landing-workspace-scene")
        ?.getAttribute("data-agent");

      expect(
        container
          .querySelector(".landing-title-avatar img")
          ?.getAttribute("src")
      ).toBe(`/characters/${avatar}.png`);
    };

    await tick();
    expect(
      container
        .querySelector(".landing-workspace-scene")
        ?.getAttribute("data-agent")
    ).toBe("dimas");
    await tick();
    expect(
      container
        .querySelector(".landing-workspace-scene")
        ?.getAttribute("data-agent")
    ).toBe("kezia");
    await tick();
    expect(
      container
        .querySelector(".landing-workspace-scene")
        ?.getAttribute("data-agent")
    ).toBe("hana");

    await act(async () => {
      Object.defineProperty(preference, "matches", {
        configurable: true,
        value: true,
      });
      preference.dispatchEvent(new window.Event("change"));
    });
    expect(callbacks.size).toBe(0);

    const marketing = container.querySelectorAll<HTMLButtonElement>(
      ".landing-team-picker button"
    )[2];

    await act(async () => marketing?.click());
    expect(
      container
        .querySelector(".landing-workspace-scene")
        ?.getAttribute("data-agent")
    ).toBe("kezia");

    await act(async () => {
      Object.defineProperty(preference, "matches", {
        configurable: true,
        value: false,
      });
      preference.dispatchEvent(new window.Event("change"));
    });
    expect(callbacks.size).toBe(1);
    await act(async () => root.unmount());
    unmounted = true;
    expect(callbacks.size).toBe(0);
  } finally {
    if (!unmounted) {
      await act(async () => root.unmount());
    }

    container.remove();
    matchMedia.mockRestore();
    setInterval.mockRestore();
    clearInterval.mockRestore();
  }
});

test("scroll observers reveal once and release all observed nodes on unmount", async () => {
  const original = Object.getOwnPropertyDescriptor(
    globalThis,
    "IntersectionObserver"
  );

  const observers: Observer[] = [];

  class Observer implements IntersectionObserver {
    root = null;
    rootMargin = "0px";
    thresholds = [0];
    takeRecords = () => [];
    callback: IntersectionObserverCallback;
    observe = mock();
    unobserve = mock();
    disconnect = mock();
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
      observers.push(this);
    }
  }

  Object.defineProperty(globalThis, "IntersectionObserver", {
    configurable: true,
    value: Observer,
  });
  const { container, root } = await mountLanding();
  let unmounted = false;

  try {
    expect(observers).toHaveLength(2);

    const scroll = observers.find(
      (observer) => observer.observe.mock.calls.length > 1
    );

    const target = container.querySelector("[data-reveal]");
    expect(target).not.toBeNull();
    expect(scroll).toBeDefined();
    await act(async () => {
      // SAFETY: The landing callback reads only target and isIntersecting.
      scroll?.callback(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        scroll
      );
    });
    expect(target?.getAttribute("data-in-view")).toBe("true");
    expect(scroll?.unobserve).toHaveBeenCalledWith(target);
    const flow = container.querySelector(".landing-flow");

    for (const isIntersecting of [true, false, true]) {
      await act(async () => {
        // SAFETY: The callback reads only target and isIntersecting.
        scroll?.callback(
          [{ isIntersecting, target: flow } as IntersectionObserverEntry],
          scroll
        );
      });
      expect(flow?.getAttribute("data-flow-visible")).toBe(
        String(isIntersecting)
      );
    }

    expect(scroll?.unobserve).not.toHaveBeenCalledWith(flow);
    await act(async () => root.unmount());
    unmounted = true;

    for (const observer of observers) {
      expect(observer.disconnect).toHaveBeenCalledTimes(1);
    }
  } finally {
    if (!unmounted) {
      await act(async () => root.unmount());
    }

    container.remove();

    if (original) {
      Object.defineProperty(globalThis, "IntersectionObserver", original);
    } else {
      Reflect.deleteProperty(globalThis, "IntersectionObserver");
    }
  }
});
