import { useEffect, useState, useRef } from "react";

export const useSeatLayoutStatus = ({ requestKey, movie, date, time, onReset }) => {
  const [resolvedKey, setResolvedKey] = useState(requestKey);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const onResetRef = useRef(onReset);
  const prevDepsRef = useRef({ movie, date, time, requestKey });

  // Keep the ref updated when onReset changes
  useEffect(() => {
    onResetRef.current = onReset;
  }, [onReset]);

  useEffect(() => {
    const prev = prevDepsRef.current;
    const hasChanged =
      prev.movie !== movie ||
      prev.date !== date ||
      prev.time !== time ||
      prev.requestKey !== requestKey;
    
    prevDepsRef.current = { movie, date, time, requestKey };

    const timer = window.setTimeout(() => {
      // Only reset if dependencies have changed (not on initial mount)
      if (hasChanged) {
        onResetRef.current?.();
      }
      setErrorMessage("");

      if (!movie) {
        setStatus("error");
        setErrorMessage("Movie not found.");
        setResolvedKey(requestKey);
        return;
      }
      if (!date) {
        setStatus("error");
        setErrorMessage("Missing show date.");
        setResolvedKey(requestKey);
        return;
      }
      if (!time) {
        setStatus("error");
        setErrorMessage("Missing show time. Please pick a time slot.");
        setResolvedKey(requestKey);
        return;
      }

      setStatus("ready");
      setResolvedKey(requestKey);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [movie, date, requestKey, time]);

  const isResolving = resolvedKey !== requestKey;

  return { status, errorMessage, isResolving };
};