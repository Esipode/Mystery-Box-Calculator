import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setSimMode } from "../actions";

export default function BoxSimToggle() {
  const dispatch = useDispatch();
  const simMode = useSelector((state) => state.simMode);
  const simRunning = useSelector((state) => state.simRunning);

  return (
    <div className="boxSimToggle">
    <p
        className={`toggleContainer ${
        simMode === "simulator" ? "active" : ""
        } ${simRunning ? "disable-btn" : ""}`}
        onClick={() => !simRunning && dispatch(setSimMode("simulator"))}
    >
        <i className="fas fa-box-open" />
        Simulator
    </p>
    <p
        className={`toggleContainer ${
        simMode === "probability" ? "active" : ""
        } ${simRunning ? "disable-btn" : ""}`}
        onClick={() => !simRunning && dispatch(setSimMode("probability"))}
    >
        <i className="fas fa-percentage" />
        Probability
    </p>
    </div>
  );
}
