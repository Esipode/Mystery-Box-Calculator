import React, { useState, useEffect, useMemo, useCallback } from "react";
import data from "../data.json";
import Select from "react-select";

import { useSelector, useDispatch } from "react-redux";
import { setSimRunning } from "../actions";

import calcBox from "./helperFunctions/calcBox";
import calcItem from "./helperFunctions/calcItem";
import BoxSimToggle from './boxSimToggle';

const { boxes } = data;

export default function ProbabilitySim({ simMode }) {
  const dispatch = useDispatch();
  const fullMTXList = useSelector((state) => state.fullMTXList);
  const mode = useSelector((state) => state.currMode);
  const activeBox = useSelector((state) => state.activeBox);
  const activeMTX = useSelector((state) => state.activeMTX);
  const simRunning = useSelector((state) => state.simRunning);
  const ownedList = useSelector((state) => state.ownedList);
  

  const itemList = useMemo(() => {
    return fullMTXList.map((item) => {
      return {
        value: { item },
        label: (
          <div className="listItem">
            {item.name}
            <img src={item.image} alt={item.name} />
          </div>
        ),
      };
    });
  }, [fullMTXList]);

  const [probFilter, setProbFilter] = useState("box");
  const [itemSelected, setItemSelected] = useState(itemList[0]);
  const [iterations, setIterations] = useState(10);
  const [boxVal, setBoxVal] = useState(null);
  const [boxCalcCurrent, setBoxCalcCurrent] = useState({
    iteration: 0,
    boxes: 0,
    points: 0,
    found: [0, 0],
    percent: 0,
  });
  const [boxCalcList, setBoxCalcList] = useState([]);
  const [itemCalcCurrent, setItemCalcCurrent] = useState({
    iteration: 0,
    boxes: 0,
    points: 0,
    found: false,
    percent: 0,
  });
  const [itemCalcList, setItemCalcList] = useState([]);

  //Correct number of boxes if it exceeds number of options in new mode
	useEffect(() => {
    const maxSize = fullMTXList.length - ownedList.length;
		if (mode === 'new' && boxVal > maxSize) {
			setBoxVal(maxSize);
		}
	}, [boxVal, fullMTXList, mode, ownedList])

  //Reset displayed item when box changes
  useEffect(() => {
    setBoxCalcCurrent({
      iteration: 0,
      boxes: 0,
      points: 0,
      found: [0, 0],
      percent: 0,
    });
    setBoxCalcList([]);
    setItemCalcCurrent({
      iteration: 0,
      boxes: 0,
      points: 0,
      found: false,
      percent: 0,
    });
    setItemCalcList([]);
    setItemSelected(itemList[0]);
  }, [itemList]);

  const boxImage = useMemo(() => {
    const image = boxes.filter((currBox) => currBox.name === activeBox)[0]?.image;
    if (image) return image;
    else {
      const mtxs = boxes.filter((currBox) => currBox.name === activeBox)[0]?.mtx;
      const imageIndex = Math.floor(Math.random() * mtxs?.length);
      return mtxs?.[imageIndex]?.image;
    }
  }, [activeBox]);
  
  const getAverage = (arr) => {
    let value = 0;
    if (typeof arr[0] === "boolean") {
      for (let i in arr) {
        arr[i] && value++;
      }
      return `${value} / ${arr.length}`
    }
    else {
      for (let i in arr) {
        value += arr[i];
      }
      value = value / arr.length;
      return value;
    }
  }

  const runBoxCalc = useCallback(() => {
    if (simMode === "probability" && simRunning && activeBox) {
      probFilter === "box" && calcBox({ 
        fullMTXList, 
        activeMTX,
        ownedList,
        iterations, 
        simRunning, 
        boxVal, 
        boxCalcList, 
        setBoxCalcList, 
        setBoxCalcCurrent,
        mode,
      }).then(() => dispatch(setSimRunning(false)));
      probFilter === "item" && calcItem({ 
        fullMTXList, 
        iterations, 
        simRunning, 
        itemSelected, 
        boxVal, 
        itemCalcList, 
        setItemCalcList, 
        setItemCalcCurrent,
        mode,
      }).then(() => dispatch(setSimRunning(false)));
    }
  }, [
    activeBox,
    probFilter, 
    simMode, 
    simRunning, 
    activeMTX,
    ownedList,
    boxCalcList, 
    boxVal, 
    dispatch, 
    fullMTXList, 
    itemCalcList, 
    itemSelected, 
    iterations,
    mode
  ])

  //Run box calculation when start button pressed
  useEffect(() => runBoxCalc(), [runBoxCalc]);

  return (
    <div
      className={`probabilitySim${
        simMode === "probability" ? "" : " hideContainer"
      }`}
    >
      <div className="sim-header">
        <BoxSimToggle />
        {activeBox && (
          <div className="selectorContainer">
            <h4
              className={`boxSelector ${
                probFilter === "box" ? "activeFilter" : ""
              } ${simRunning ? "disabledContainer" : ""}`}
              onClick={() => setProbFilter("box")}
            >
              <img src={boxImage} alt='selected-items-toggle' />
              <span>Selected Items</span>
            </h4>
            <button
              className={`${simRunning ? "disable-btn" : ""}`}
              onClick={() => {
                if (probFilter === "box") {
                  setBoxCalcCurrent({
                    iteration: 0,
                    boxes: 0,
                    points: 0,
                    found: [0, 0],
                    percent: 0,
                  });
                  setBoxCalcList([]);
                } else if (probFilter === "item") {
                  setItemCalcCurrent({
                    iteration: 0,
                    boxes: 0,
                    points: 0,
                    found: false,
                    percent: 0,
                  });
                  setItemCalcList([]);
                }
                dispatch(setSimRunning(true));
              }}
              disabled={simRunning}
            >
              <i className="fas fa-play" />
            </button>
            <Select
              className={`react-select ${
                probFilter === "item" ? "activeSelect" : ""
              } ${simRunning ? "disabledContainer" : ""}`}
              classNamePrefix="react-select"
              defaultValue={itemList[0]}
              value={itemSelected}
              onChange={(e) => {
                if ((itemSelected.value.item.name !== e.value.item.name) || probFilter === "box") {
                  setItemSelected(e);
                  setItemCalcCurrent({
                    iteration: 0,
                    boxes: 0,
                    points: 0,
                    found: false,
                    percent: 0,
                  });
                  setItemCalcList([]);
                  setProbFilter("item");
                }
              }}
              options={itemList}
              isSearchable={false}
              disabled={simRunning}
            />
          </div>
        )}
        <div className="input-container">
          <h4 className={`iteration-input ${simRunning ? "disabled" : ""}`}>
            Iterations:
            <input
              type="text"
              pattern={"[0-9]*"}
              maxLength="3"
              disabled={simRunning}
              onChange={(e) =>
                setIterations(
                  e.target.value > 100 ? 100 : e.target.value.replace(/\D/, "")
                )
              }
              value={iterations || ''}
              placeholder="#"
              onPaste={(e) => e.preventDefault()}
            />
          </h4>
          <h4 className={`boxes-input ${simRunning ? "disabled" : ""}`}>
            Max Boxes:
            <input
              type="text"
              pattern={"[0-9]*"}
              maxLength="3"
              disabled={simRunning}
              onChange={(e) => setBoxVal(e.target.value.replace(/\D/, ""))}
              value={boxVal || ''}
              placeholder="#"
              onPaste={(e) => e.preventDefault()}
            />
          </h4>
        </div>
      </div>
      {probFilter === "box" && (
        <div className="boxCalcListContainer">
          <table>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>Boxes</th>
                <th>Points</th>
                <th>Found</th>
                <th>Chance</th>
              </tr>
            </thead>
            <tbody>
              {simRunning && (
                <tr>
                  <td># {boxCalcCurrent.iteration}</td>
                  <td>{boxCalcCurrent.boxes}</td>
                  <td>{boxCalcCurrent.points}</td>
                  <td>
                    {boxCalcCurrent.found[0]} / {boxCalcCurrent.found[1]}
                  </td>
                  <td>{boxCalcCurrent.percent} %</td>
                </tr>
              )}
              {!simRunning && boxCalcList?.[0]?.boxes > 0 && (
                <tr style={{background: 'rgba(var(--mainColor), 0.4)'}}>
                  <td>Avg</td>
                  <td>{getAverage(boxCalcList.map(currBox => currBox.boxes)).toFixed(0)}</td>
                  <td>{getAverage(boxCalcList.map(currBox => currBox.boxes)).toFixed(0) * (mode === 'new' ? 50 : 30)}</td>
                  <td>{getAverage(boxCalcList.map(currBox => currBox.found[0])).toFixed(0)} / {boxCalcCurrent.found[1]}</td>
                  <td>{getAverage(boxCalcList.map(currBox => parseFloat(currBox.percent))).toFixed(2)} %</td>
                </tr>
              )}
              {boxCalcList.map((round, index) => {
                return (
                  <tr key={index}>
                    <td># {round.iteration}</td>
                    <td>{round.boxes}</td>
                    <td>{round.points}</td>
                    <td>
                      {round.found[0]} / {round.found[1]}
                    </td>
                    <td>{round.percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {probFilter === "item" && (
        <div className="boxItemListContainer">
          <table>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>Boxes</th>
                <th>Points</th>
                <th>Found</th>
                <th>Chance</th>
              </tr>
            </thead>
            <tbody>
              {simRunning && (
                <tr>
                  <td># {itemCalcCurrent.iteration}</td>
                  <td>{itemCalcCurrent.boxes}</td>
                  <td>{itemCalcCurrent.points}</td>
                  <td>{itemCalcCurrent.found}</td>
                  <td>{itemCalcCurrent.percent} %</td>
                </tr>
              )}
              {!simRunning && itemCalcList?.[0]?.boxes > 0 && (
                <tr style={{background: 'rgba(var(--mainColor), 0.4)'}}>
                  <td>Avg</td>
                  <td>{getAverage(itemCalcList.map(item => item.boxes)).toFixed(0)}</td>
                  <td>{getAverage(itemCalcList.map(item => item.boxes)).toFixed(0) * (mode === 'new' ? 50 : 30)}</td>
                  <td>{getAverage(itemCalcList.map(item => item.found))}</td>
                  <td>{getAverage(itemCalcList.map(item => parseFloat(item.percent))).toFixed(2)} %</td>
                </tr>
              )}
              {itemCalcList.map((round, index) => {
                return (
                  <tr key={index}>
                    <td># {round.iteration}</td>
                    <td>{round.boxes}</td>
                    <td>{round.points}</td>
                    <td>
                      {round.found ? (
                        <i
                          className="fas fa-check"
                          style={{
                            color: "#090",
                            textShadow: "0px 0px 2px rgba(255, 255, 255, 0.3)",
                          }}
                        />
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{
                            color: "#b00",
                            textShadow: "0px 0px 2px rgba(255, 255, 255, 0.3)",
                          }}
                        />
                      )}
                    </td>
                    <td>{round.percent} %</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
