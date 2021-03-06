import React, { useEffect, useState } from "react";
import SimBoxes from "./simBoxes";
import startSim from "./startSim";
import ProbabilitySim from "./probabilitySim";

import { useSelector, useDispatch } from "react-redux";
import {
  setBoxChanged,
  setSimRunning,
  setPrevBoxVal,
  setCompletedList,
  setResultsSubmitted,
} from "../actions";

export default function BoxSimulator() {
  const dispatch = useDispatch();
  const fullMTXList = useSelector((state) => state.fullMTXList);
  const activeMTX = useSelector((state) => state.activeMTX);
  const simRunning = useSelector((state) => state.simRunning);
  const boxVal = useSelector((state) => state.boxVal);

  const [simMode, setSimMode] = useState("simulator");

  //Forces waiting between each time an item is randomly selected
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const simToggle = () => {
    dispatch(setSimRunning(!simRunning));
    dispatch(setBoxChanged(false));
  };

  useEffect(() => {
    simMode === "simulator" &&
      simRunning &&
      boxVal > 0 &&
      startSim(
        dispatch,
        fullMTXList,
        boxVal,
        simRunning,
        activeMTX,
        setCompletedList,
        simToggle,
        setResultsSubmitted,
        sleep,
        setPrevBoxVal
      );
  }, [simRunning]);

  return (
    <div className="boxSimulatorContainer">
      <div className="boxSimToggle">
        <p
          className={`toggleContainer ${
            simMode === "simulator" ? "active" : ""
          } ${simRunning ? "disable-btn" : ""}`}
          onClick={() => !simRunning && setSimMode("simulator")}
        >
          <i className="fas fa-box-open" />
          Simulator
        </p>
        <p
          className={`toggleContainer ${
            simMode === "probability" ? "active" : ""
          } ${simRunning ? "disable-btn" : ""}`}
          onClick={() => !simRunning && setSimMode("probability")}
        >
          <i className="fas fa-percentage" />
          Probability
        </p>
      </div>
      <SimBoxes simToggle={simToggle} simMode={simMode} />
      <ProbabilitySim simMode={simMode} sleep={sleep} />
    </div>
  );
}
