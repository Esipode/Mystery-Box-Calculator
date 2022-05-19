import React, { useEffect, useCallback } from "react";
import SimBoxes from "./simBoxes";
import startSim from "./helperFunctions/startSim";
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
  const simMode = useSelector((state) => state.simMode);
  const fullMTXList = useSelector((state) => state.fullMTXList);
  const activeMTX = useSelector((state) => state.activeMTX);
  const simRunning = useSelector((state) => state.simRunning);
  const boxVal = useSelector((state) => state.boxVal);
  const mode = useSelector((state) => state.currMode);

  const simToggle = useCallback(() => {
    dispatch(setSimRunning(!simRunning));
    dispatch(setBoxChanged(false));
  }, [dispatch, simRunning]);

  const startSimulation = useCallback(() => {
    if (simMode === "simulator" && simRunning && boxVal > 0) {
      dispatch(setPrevBoxVal(0));
      startSim(
        activeMTX,
        boxVal,
        dispatch,
        fullMTXList,
        mode,
        setCompletedList,
        setPrevBoxVal,
        setResultsSubmitted,
        simRunning,
        simToggle,
      ).then(({ selectedItems, newBoxVal }) => {
        dispatch(setCompletedList(selectedItems));
        dispatch(setPrevBoxVal(newBoxVal));
      })
      
    }
  }, [activeMTX, boxVal, dispatch, fullMTXList, mode, simMode, simRunning, simToggle]);

  useEffect(() => startSimulation(), [startSimulation]);

  return (
    <div className="boxSimulatorContainer">
      <SimBoxes simToggle={simToggle} simMode={simMode} />
      <ProbabilitySim simMode={simMode} />
    </div>
  );
}
