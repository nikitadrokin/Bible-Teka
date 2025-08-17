import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { g as useSyncLanguage, d as useBible, u as useLocaleStore, c as cn, e as useHistoryStore, b as bibleBooksEnglish, a as bibleBooksRussian, f as formatDateTime } from './ssr.mjs';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as LabelPrimitive from '@radix-ui/react-label';
import { useTranslation } from 'react-i18next';
import { BookOpenIcon, ClockIcon, XIcon, Gauge, VolumeX, Volume2, Pause, Play, ChevronDownIcon, CheckIcon, ChevronUpIcon } from 'lucide-react';
import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as SelectPrimitive from '@radix-ui/react-select';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Drawer as Drawer$1 } from 'vaul';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import '@tanstack/react-router';
import '@tanstack/react-query';
import 'superjson';
import '@trpc/client';
import '@trpc/tanstack-react-query';
import 'clsx';
import 'tailwind-merge';
import '@trpc/server/adapters/fetch';
import '@trpc/server';
import 'i18next';
import 'node:async_hooks';
import '@tanstack/react-router/ssr/server';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "hover:text-white hover:shadow-xs hover:bg-destructive/60 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function BookSelector({
  selectedBookId,
  onBookSelect
}) {
  const { t } = useTranslation();
  const { locale } = useLocaleStore();
  const books = locale === "en" ? bibleBooksEnglish : bibleBooksRussian;
  const oldTestamentBooks = books.slice(0, 39);
  const newTestamentBooks = books.slice(39);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: t("selectBook") }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium leading-none", children: t("oldTestament") }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "grid gap-y-2 gap-x-4",
              locale === "en" ? "grid-cols-[repeat(auto-fill,minmax(115px,1fr))]" : "grid-cols-[repeat(auto-fill,minmax(145px,1fr))]"
            ),
            children: oldTestamentBooks.map((book) => /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => onBookSelect(book.id.toString()),
                variant: selectedBookId === book.id.toString() ? "secondary" : "ghost",
                size: "sm",
                type: "button",
                "aria-selected": selectedBookId === book.id.toString(),
                className: "justify-start transition-none",
                children: book.name
              },
              book.id
            ))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium leading-none", children: t("newTestament") }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "grid gap-y-2 gap-x-4",
              locale === "en" ? "grid-cols-[repeat(auto-fill,minmax(115px,1fr))]" : "grid-cols-[repeat(auto-fill,minmax(145px,1fr))]"
            ),
            children: newTestamentBooks.map((book) => /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => onBookSelect(book.id.toString()),
                variant: selectedBookId === book.id.toString() ? "secondary" : "ghost",
                size: "sm",
                type: "button",
                "aria-selected": selectedBookId === book.id.toString(),
                className: "justify-start transition-none",
                children: book.name
              },
              book.id
            ))
          }
        )
      ] })
    ] })
  ] });
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function BibleInfo({ book }) {
  const { selection } = useBible();
  if (!book || !selection.chapter) {
    return /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-36" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center w-fit gap-2 px-3 py-1.5 rounded-lg text-muted-foreground bg-muted font-medium", children: [
    /* @__PURE__ */ jsx(BookOpenIcon, { className: "h-4 w-4" }),
    /* @__PURE__ */ jsxs("span", { className: cn("whitespace-nowrap"), children: [
      book.name,
      " ",
      selection.chapter
    ] })
  ] });
}
function ChapterSelector({
  chapters,
  selectedChapter,
  onChapterSelect,
  disabled
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium leading-none", children: t("selectChapter") }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-2 grid-cols-[repeat(auto-fill,minmax(60px,1fr))]", children: chapters.map((chapter) => /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => onChapterSelect(chapter.toString()),
        variant: selectedChapter === chapter.toString() ? "secondary" : "ghost",
        size: "sm",
        type: "button",
        disabled,
        "aria-selected": selectedChapter === chapter.toString(),
        children: chapter
      },
      chapter
    )) })
  ] });
}
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = React.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ jsxs(
    SliderPrimitive.Root,
    {
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      className: cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          SliderPrimitive.Track,
          {
            "data-slot": "slider-track",
            className: cn(
              "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            ),
            children: /* @__PURE__ */ jsx(
              SliderPrimitive.Range,
              {
                "data-slot": "slider-range",
                className: cn(
                  "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                )
              }
            )
          }
        ),
        Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ jsx(
          SliderPrimitive.Thumb,
          {
            "data-slot": "slider-thumb",
            className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          },
          index
        ))
      ]
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border-2 bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border-2 shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
const useAudioStore = create()(
  persist(
    (set) => ({
      playbackSpeed: 1,
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed })
    }),
    {
      name: "bible-teka-audio-settings"
    }
  )
);
function useWakeLock({
  restoreOnVisibilityChange = true,
  enabled = true
} = {}) {
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef(null);
  const isSupported = "wakeLock" in navigator && "request" in navigator.wakeLock;
  const release = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsActive(false);
    }
  }, []);
  const request = useCallback(async () => {
    if (!isSupported || !enabled) {
      return false;
    }
    try {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      setIsActive(true);
      wakeLockRef.current.addEventListener("release", () => {
        setIsActive(false);
        wakeLockRef.current = null;
      });
      return true;
    } catch (error) {
      console.warn("Failed to request wake lock:", error);
      setIsActive(false);
      wakeLockRef.current = null;
      return false;
    }
  }, [isSupported, enabled]);
  const toggle = useCallback(async () => {
    if (isActive) {
      release();
      return false;
    } else {
      return await request();
    }
  }, [isActive, request, release]);
  useEffect(() => {
    if (!restoreOnVisibilityChange || !isSupported || !enabled) {
      return;
    }
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) {
        setTimeout(() => {
          request();
        }, 100);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [restoreOnVisibilityChange, isSupported, enabled, request]);
  useEffect(() => {
    return () => {
      release();
    };
  }, [release]);
  return {
    isActive,
    isSupported,
    request,
    release,
    toggle
  };
}
function useMediaSession({
  isPlaying,
  currentTime,
  duration,
  book,
  chapter,
  onPlay,
  onPause,
  onSeek
}) {
  const { t } = useTranslation();
  const artist = t("appTitle");
  const lastUpdateRef = useRef(0);
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock();
  const handleSeekForward = (details) => {
    const { seekOffset = 10 } = details;
    const newTime = Math.min(currentTime + seekOffset, duration);
    onSeek(newTime);
  };
  const handleSeekBackward = (details) => {
    const { seekOffset = 10 } = details;
    const newTime = Math.max(currentTime - seekOffset, 0);
    onSeek(newTime);
  };
  useEffect(() => {
    if (!("mediaSession" in navigator) || !book || !chapter) return;
    const metadata = {
      title: `${book.name} ${chapter}`,
      artist,
      album: book.name,
      artwork: [
        {
          src: "/logo.png",
          sizes: "any",
          type: "image/png"
        }
      ]
    };
    navigator.mediaSession.metadata = new MediaMetadata(metadata);
  }, [book, chapter]);
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const actionHandlers = [
      ["play", onPlay],
      ["pause", onPause],
      ["seekbackward", handleSeekBackward],
      ["seekforward", handleSeekForward]
    ];
    actionHandlers.push([
      "seekto",
      (details) => {
        if (details.seekTime !== void 0) {
          onSeek(details.seekTime);
        }
      }
    ]);
    actionHandlers.forEach(([action, handler]) => {
      navigator.mediaSession.setActionHandler(action, handler);
    });
    return () => {
      actionHandlers.forEach(([action]) => {
        navigator.mediaSession.setActionHandler(action, null);
      });
    };
  }, [onPlay, onPause, onSeek, currentTime, duration]);
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);
  useEffect(() => {
    if (isPlaying) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [isPlaying, requestWakeLock, releaseWakeLock]);
  useEffect(() => {
    if (!("mediaSession" in navigator) || !duration || duration === 0) return;
    const now = Date.now();
    if (now - lastUpdateRef.current < 1e3) return;
    lastUpdateRef.current = now;
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: 1,
      position: currentTime
    });
  }, [currentTime, duration]);
}
const PLAYBACK_SPEEDS = [
  { value: "1", label: "1x" },
  { value: "1.1", label: "1.1x" },
  { value: "1.2", label: "1.2x" },
  { value: "1.25", label: "1.25x" },
  { value: "1.5", label: "1.5x" },
  { value: "2", label: "2x" }
];
function AudioPlayer({
  src,
  book,
  chapter,
  className,
  onEnded,
  onNextTrack,
  onPreviousTrack,
  ...props
}) {
  const audioRef = useRef(null);
  const autoPlayTimeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const { playbackSpeed, setPlaybackSpeed } = useAudioStore();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    loadingState: "initial",
    autoplayAttempted: false,
    autoplaySuccess: false,
    autoplayError: null,
    canPlay: false,
    canPlayThrough: false,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    lastEvent: "none",
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
    networkState: "unknown",
    readyState: "unknown",
    bufferedRanges: "none",
    duration: 0,
    currentSrc: "",
    loadStartTime: null,
    iosLoadingTriggered: false
  });
  const updateDebug = (updates) => {
    setDebugInfo((prev) => ({
      ...prev,
      ...updates,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    }));
  };
  const getNetworkStateText = (state) => {
    switch (state) {
      case 0:
        return "NETWORK_EMPTY";
      case 1:
        return "NETWORK_IDLE";
      case 2:
        return "NETWORK_LOADING";
      case 3:
        return "NETWORK_NO_SOURCE";
      default:
        return `UNKNOWN(${state})`;
    }
  };
  const getReadyStateText = (state) => {
    switch (state) {
      case 0:
        return "HAVE_NOTHING";
      case 1:
        return "HAVE_METADATA";
      case 2:
        return "HAVE_CURRENT_DATA";
      case 3:
        return "HAVE_FUTURE_DATA";
      case 4:
        return "HAVE_ENOUGH_DATA";
      default:
        return `UNKNOWN(${state})`;
    }
  };
  const getBufferedRanges = (audio) => {
    const buffered = audio.buffered;
    if (buffered.length === 0) return "none";
    const ranges = [];
    for (let i = 0; i < buffered.length; i++) {
      ranges.push(
        `${buffered.start(i).toFixed(1)}-${buffered.end(i).toFixed(1)}`
      );
    }
    return ranges.join(", ");
  };
  const triggerIOSLoading = async (audio) => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (!isIOS) return false;
    updateDebug({
      iosLoadingTriggered: true,
      loadingState: "triggering-ios-loading",
      lastEvent: "ios-loading-trigger"
    });
    try {
      const playPromise = audio.play();
      if (playPromise) {
        await playPromise;
        audio.pause();
        audio.currentTime = 0;
        updateDebug({
          loadingState: "ios-loading-triggered",
          lastEvent: "ios-loading-success"
        });
        return true;
      }
    } catch (err) {
      console.log("iOS loading trigger failed (expected):", err);
      updateDebug({
        lastEvent: "ios-loading-failed",
        autoplayError: err instanceof Error ? err.message : "iOS loading trigger failed"
      });
    }
    return false;
  };
  const handlePlay = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setError(null);
      updateDebug({ autoplaySuccess: true, lastEvent: "manual-play-success" });
    } catch (err) {
      console.error("Play error:", err);
      setError("Failed to play audio. Please try again.");
      updateDebug({
        autoplayError: err instanceof Error ? err.message : "Unknown play error",
        lastEvent: "manual-play-error"
      });
    }
  };
  const handlePause = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.pause();
      setIsPlaying(false);
      updateDebug({ lastEvent: "pause" });
    } catch (err) {
      console.error("Pause error:", err);
    }
  };
  const handleSeek = (time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  useMediaSession({
    isPlaying,
    currentTime,
    duration,
    book: book != null ? book : null,
    chapter: chapter != null ? chapter : null,
    onPlay: handlePlay,
    onPause: handlePause,
    onSeek: handleSeek
  });
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    updateDebug({
      loadingState: "setting-up-listeners",
      lastEvent: "setup-start",
      currentSrc: audio.src,
      loadStartTime: Date.now()
    });
    const updateAudioState = (eventName) => {
      updateDebug({
        lastEvent: eventName,
        networkState: getNetworkStateText(audio.networkState),
        readyState: getReadyStateText(audio.readyState),
        bufferedRanges: getBufferedRanges(audio),
        duration: audio.duration || 0
      });
    };
    const handleLoadStart = () => {
      updateDebug({
        loadingState: "load-started",
        lastEvent: "loadstart",
        loadStartTime: Date.now()
      });
      updateAudioState("loadstart");
    };
    const handleLoadedData = () => {
      updateDebug({
        loadingState: "data-loaded",
        lastEvent: "loadeddata"
      });
      updateAudioState("loadeddata");
    };
    const handleProgress = () => {
      updateAudioState("progress");
    };
    const handleSuspend = () => {
      updateDebug({
        loadingState: "suspended",
        lastEvent: "suspend"
      });
      updateAudioState("suspend");
    };
    const handleStalled = () => {
      updateDebug({
        loadingState: "stalled",
        lastEvent: "stalled"
      });
      updateAudioState("stalled");
    };
    const handleWaiting = () => {
      updateDebug({
        lastEvent: "waiting"
      });
      updateAudioState("waiting");
    };
    const handleTimeUpdate = () => {
      if (!isScrubbing) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      updateDebug({
        loadingState: "metadata-loaded",
        lastEvent: "loadedmetadata",
        duration: audio.duration
      });
      updateAudioState("loadedmetadata");
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIOS && !debugInfo.iosLoadingTriggered) {
        setTimeout(async () => {
          const loadingTriggered = await triggerIOSLoading(audio);
          if (loadingTriggered) {
            const waitForCanPlayThrough = () => {
              if (audio.readyState >= 4) {
                setTimeout(async () => {
                  try {
                    await audio.play();
                    setIsPlaying(true);
                    updateDebug({
                      autoplayAttempted: true,
                      autoplaySuccess: true,
                      loadingState: "playing",
                      lastEvent: "ios-autoplay-success"
                    });
                  } catch (err) {
                    console.error("iOS auto-play failed:", err);
                    updateDebug({
                      autoplayAttempted: true,
                      autoplayError: err instanceof Error ? err.message : "iOS autoplay failed",
                      autoplaySuccess: false,
                      lastEvent: "ios-autoplay-failed"
                    });
                  }
                }, 500);
              } else {
                setTimeout(waitForCanPlayThrough, 100);
              }
            };
            waitForCanPlayThrough();
          }
        }, 1e3);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      updateDebug({ lastEvent: "ended" });
      if (onEnded) {
        onEnded();
      }
    };
    const handleError = (e) => {
      const target = e.target;
      const error2 = target.error;
      console.error("Audio playback error:", error2);
      setError("Failed to play audio. Please try again.");
      setIsPlaying(false);
      updateDebug({
        loadingState: "error",
        autoplayError: error2 ? `${error2.code}: ${error2.message}` : "Audio error event",
        lastEvent: "error"
      });
      updateAudioState("error");
    };
    const handleCanPlay = () => {
      setError(null);
      updateDebug({
        canPlay: true,
        loadingState: "can-play",
        lastEvent: "canplay"
      });
      updateAudioState("canplay");
    };
    const handleCanPlayThrough = () => {
      updateDebug({
        canPlayThrough: true,
        loadingState: "can-play-through",
        lastEvent: "canplaythrough"
      });
      updateAudioState("canplaythrough");
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      autoPlayTimeoutRef.current = setTimeout(async () => {
        updateDebug({
          autoplayAttempted: true,
          lastEvent: "autoplay-attempt"
        });
        try {
          await audio.play();
          setIsPlaying(true);
          setError(null);
          updateDebug({
            autoplaySuccess: true,
            loadingState: "playing",
            lastEvent: "autoplay-success"
          });
        } catch (err) {
          console.error("Auto-play failed:", err);
          updateDebug({
            autoplayError: err instanceof Error ? err.message : "Unknown autoplay error",
            autoplaySuccess: false,
            lastEvent: "autoplay-failed"
          });
        }
      }, 500);
    };
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("progress", handleProgress);
    audio.addEventListener("suspend", handleSuspend);
    audio.addEventListener("stalled", handleStalled);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.playbackRate = playbackSpeed;
    audio.preload = "metadata";
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("progress", handleProgress);
      audio.removeEventListener("suspend", handleSuspend);
      audio.removeEventListener("stalled", handleStalled);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [playbackSpeed, onEnded, isScrubbing]);
  useEffect(() => {
    setCurrentTime(0);
    updateDebug({
      loadingState: "loading-new-src",
      autoplayAttempted: false,
      autoplaySuccess: false,
      autoplayError: null,
      canPlay: false,
      canPlayThrough: false,
      lastEvent: "src-changed",
      iosLoadingTriggered: false
    });
  }, [src]);
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);
  const togglePlayPause = async () => {
    if (isPlaying) {
      await handlePause();
    } else {
      await handlePlay();
    }
  };
  const handleScrubStart = () => {
    setIsScrubbing(true);
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  };
  const handleScrubEnd = () => {
    setIsScrubbing(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Error resuming playback after scrub:", err);
      });
    }
  };
  const handleTimeChange = (value) => {
    if (!audioRef.current || !value.length) return;
    const newTime = value[0];
    setCurrentTime(newTime);
    if (Math.abs(audioRef.current.currentTime - newTime) > 0.5) {
      audioRef.current.currentTime = newTime;
    }
  };
  const handleVolumeChange = (value) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };
  const handleSpeedChange = (value) => {
    if (!audioRef.current) return;
    const speed = parseFloat(value);
    audioRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-col gap-4 rounded-lg border-2 bg-card p-4",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("audio", { ref: audioRef, src }),
        error && /* @__PURE__ */ jsx("div", { className: "text-sm text-destructive text-center", children: error }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-x-2 gap-y-4 flex-wrap", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxs(
            Select,
            {
              value: playbackSpeed.toString(),
              onValueChange: handleSpeedChange,
              children: [
                /* @__PURE__ */ jsxs(SelectTrigger, { className: "h-8 w-28 gap-0", children: [
                  /* @__PURE__ */ jsx(Gauge, { className: "mr-2 h-3 w-3" }),
                  /* @__PURE__ */ jsx(SelectValue, {})
                ] }),
                /* @__PURE__ */ jsx(SelectContent, { children: PLAYBACK_SPEEDS.map((speed) => /* @__PURE__ */ jsx(SelectItem, { value: speed.value, children: speed.label }, speed.value)) })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: toggleMute,
                className: "h-8 w-8",
                children: isMuted ? /* @__PURE__ */ jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Slider,
              {
                value: [isMuted ? 0 : volume],
                max: 1,
                step: 0.01,
                onValueChange: handleVolumeChange,
                className: "w-24"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: togglePlayPause,
              className: "h-8 w-8",
              children: isPlaying ? /* @__PURE__ */ jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center space-x-2 pl-4", children: [
            /* @__PURE__ */ jsx("span", { className: "w-12 text-sm tabular-nums", children: formatTime(currentTime) }),
            /* @__PURE__ */ jsx(
              Slider,
              {
                value: [currentTime],
                max: duration,
                step: 0.1,
                onValueChange: handleTimeChange,
                onValueCommit: handleScrubEnd,
                onPointerDown: handleScrubStart,
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "w-12 text-sm tabular-nums text-right", children: formatTime(duration) })
          ] })
        ] })
      ]
    }
  );
}
function AudioSection({
  audioUrl,
  isLoading,
  isError,
  error
}) {
  const { selection, advanceToNextChapter } = useBible();
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isLoading || (!selection.book || !selection.chapter) && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 rounded-lg border-2 bg-card p-4 flex-wrap mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-36" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 rounded-full" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 rounded-full" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center space-x-2 pl-4", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "w-12 h-4" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "w-full h-4" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "w-12 h-4" })
        ] })
      ] })
    ] }),
    isError && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-center text-destructive", children: [
      t("failedToLoadAudio"),
      " ",
      error instanceof Error ? error.message : t("unknownError")
    ] }),
    audioUrl && /* @__PURE__ */ jsx(
      AudioPlayer,
      {
        src: audioUrl,
        book: selection.book,
        chapter: selection.chapter,
        className: "mt-4",
        onEnded: advanceToNextChapter
      }
    )
  ] });
}
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, {}),
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogClose({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Close, { "data-slot": "dialog-close", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsx(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
const useIsomorphicLayoutEffect = useEffect;
function useMediaQuery(query, {
  defaultValue = false,
  initializeWithValue = true
} = {}) {
  const getMatches = (query2) => {
    {
      return defaultValue;
    }
  };
  const [matches, setMatches] = useState(() => {
    if (initializeWithValue) {
      return getMatches();
    }
    return defaultValue;
  });
  function handleChange() {
    setMatches(getMatches());
  }
  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }
    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query]);
  return matches;
}
function Drawer({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Root, { "data-slot": "drawer", ...props });
}
function DrawerTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Trigger, { "data-slot": "drawer-trigger", ...props });
}
function DrawerPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerClose({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Close, { "data-slot": "drawer-close", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  const isStandalone = false;
  return /* @__PURE__ */ jsxs(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxs(
      Drawer$1.Content,
      {
        "data-slot": "drawer-content",
        className: cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[96.5dvh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[96.5dvh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          isStandalone,
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
function DrawerHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "drawer-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function DrawerTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Title,
    {
      "data-slot": "drawer-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function HistoryDialog() {
  const { setSelection } = useBible();
  const { locale } = useLocaleStore();
  const { history, clearHistory } = useHistoryStore();
  const { t } = useTranslation();
  const books = locale === "en" ? bibleBooksEnglish : bibleBooksRussian;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleSelectHistoryItem = (entry) => {
    const book = books.find((b) => b.id === entry.bookId);
    if (book && entry.chapter) {
      setSelection({
        book,
        chapter: entry.chapter
      });
    }
  };
  const getFormattedDate = (timestamp) => {
    return formatDateTime(new Date(timestamp), locale);
  };
  const getBookName = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    return (book == null ? void 0 : book.name) || "";
  };
  if (isDesktop)
    return /* @__PURE__ */ jsxs(Dialog, { children: [
      /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", "aria-label": t("readingHistory"), children: [
        /* @__PURE__ */ jsx(ClockIcon, { className: "h-5 w-5" }),
        t("viewHistory")
      ] }) }),
      /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
          /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg font-bold mr-auto", children: t("readingHistory") }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: () => clearHistory(),
              className: "h-8 px-2 text-xs",
              children: t("clearHistory")
            }
          ),
          /* @__PURE__ */ jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", "aria-label": t("close"), children: /* @__PURE__ */ jsx(XIcon, { className: "h-5 w-5" }) }) })
        ] }),
        /* @__PURE__ */ jsx(ScrollArea, { className: "h-[300px] w-full pr-4", children: history.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: t("noHistory") }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: history.map((entry, index) => /* @__PURE__ */ jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            className: "w-full justify-start text-left h-auto py-2",
            onClick: () => handleSelectHistoryItem(entry),
            children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
                getBookName(entry.bookId),
                " ",
                entry.chapter
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: getFormattedDate(entry.timestamp) })
            ] })
          }
        ) }) }, index)) }) })
      ] })
    ] });
  return /* @__PURE__ */ jsxs(Drawer, { shouldScaleBackground: true, children: [
    /* @__PURE__ */ jsx(DrawerTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", "aria-label": t("readingHistory"), children: [
      /* @__PURE__ */ jsx(ClockIcon, { className: "h-5 w-5" }),
      t("viewHistory")
    ] }) }),
    /* @__PURE__ */ jsxs(DrawerContent, { className: "h-full", children: [
      /* @__PURE__ */ jsxs(DrawerHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
        /* @__PURE__ */ jsx(DrawerTitle, { className: "text-lg font-bold mr-auto", children: t("readingHistory") }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            size: "sm",
            onClick: () => clearHistory(),
            className: "h-8 px-2 text-xs",
            children: t("clearHistory")
          }
        ),
        /* @__PURE__ */ jsx(DrawerClose, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", "aria-label": t("close"), children: /* @__PURE__ */ jsx(XIcon, { className: "h-5 w-5" }) }) })
      ] }),
      /* @__PURE__ */ jsx(ScrollArea, { className: "w-full pr-4 mt-4", children: history.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: t("noHistory") }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2 pb-4", children: history.map((entry, index) => /* @__PURE__ */ jsx(DrawerClose, { asChild: true, children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          className: "w-full justify-start text-left h-auto py-2",
          onClick: () => handleSelectHistoryItem(entry),
          children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
              getBookName(entry.bookId),
              " ",
              entry.chapter
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: getFormattedDate(entry.timestamp) })
          ] })
        }
      ) }) }, index)) }) })
    ] })
  ] });
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator-root",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-0.5",
        className
      ),
      ...props
    }
  );
}
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const { i18n, t } = useTranslation();
  const handleValueChange = (value) => {
    setLocale(value);
    i18n.changeLanguage(value);
  };
  return /* @__PURE__ */ jsx(Tabs, { value: locale, onValueChange: handleValueChange, children: /* @__PURE__ */ jsxs(TabsList, { children: [
    /* @__PURE__ */ jsx(TabsTrigger, { value: "en", children: t("english") }),
    /* @__PURE__ */ jsx(TabsTrigger, { value: "ru", children: t("russian") })
  ] }) });
}
function BibleNavigator() {
  var _a, _b;
  const {
    t
  } = useTranslation();
  useSyncLanguage();
  const {
    selection,
    audioQuery,
    handleBookSelect,
    handleChapterSelect,
    chapters
  } = useBible();
  return /* @__PURE__ */ jsx("div", { className: "app-container bg-background", "data-vaul-drawer-wrapper": true, children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-xl grid gap-y-8 p-4 md:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground inline-block", children: t("appTitle") }),
      /* @__PURE__ */ jsx(LocaleSwitcher, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(BibleInfo, { book: selection.book }),
        /* @__PURE__ */ jsx(HistoryDialog, {})
      ] }),
      /* @__PURE__ */ jsx(AudioSection, { audioUrl: audioQuery.data, isLoading: audioQuery.isLoading, isError: audioQuery.isError, error: audioQuery.error })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-1", children: /* @__PURE__ */ jsx(Separator, {}) }),
    /* @__PURE__ */ jsx(ChapterSelector, { chapters, selectedChapter: (_a = selection.chapter) == null ? void 0 : _a.toString(), onChapterSelect: handleChapterSelect, disabled: !selection.book }),
    /* @__PURE__ */ jsx(BookSelector, { selectedBookId: (_b = selection.book) == null ? void 0 : _b.id.toString(), onBookSelect: handleBookSelect })
  ] }) });
}
const SplitComponent = () => /* @__PURE__ */ jsx(BibleNavigator, {});

export { SplitComponent as component };
//# sourceMappingURL=index-BV-h_9uX.mjs.map
