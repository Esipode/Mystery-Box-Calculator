import React, { useState, useEffect, useMemo } from "react";
import { mtxData as data } from "../data.json";
import { images as box } from "../data.json";
import Select from "react-select";

import { useSelector, useDispatch } from "react-redux";
import { setSimRunning } from "../actions";

export default function ProbabilitySim({ simMode, sleep }) {
  const dispatch = useDispatch();
  const fullMTXList = useSelector((state) => state.fullMTXList);
  const activeBox = useSelector((state) => state.activeBox);
  const activeMTX = useSelector((state) => state.activeMTX);
  const simRunning = useSelector((state) => state.simRunning);

  const itemList = useMemo(() => {
    return fullMTXList.map((item) => {
      return {
        value: { item },
        label: (
          <div className="listItem">
            {item.name}
            <img src={item.image} />
          </div>
        ),
      };
    });
  }, [activeBox]);

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
  }, [activeBox]);

  //Run box calculation when start button pressed
  useEffect(() => {
    if (simMode === "probability") {
      probFilter === "box" && simRunning && activeBox && calcBox();
      probFilter === "item" && simRunning && activeBox && calcItem();
    }
  }, [simRunning]);

  const getBoxImage = () =>
    activeBox &&
    box.filter((boxName) => boxName.name === activeBox && boxName.image)[0]
      .image;

  const calcBox = async () => {
    let fullList = JSON.parse(JSON.stringify(fullMTXList));
    let selectList = JSON.parse(JSON.stringify(activeMTX));
    let currVals = {
      iteration: 0,
      boxes: 0,
      points: 0,
      found: [0, 0],
      percent: 0,
    };
    for (let j in selectList) {
      selectList[j].count = 0;
    }
    for (let i = 0; i < iterations; ) {
      await sleep(10);
      if (!simRunning) {
        break;
      } else {
        currVals.boxes++;
        //Variable to store selected rarity of items to select from
        let curRarity;
        //Random number to decided rarity
        let chanceRoll = Math.floor(Math.random() * 100 + 1);
        //Weighted categories for deciding rarity
        switch (true) {
          case chanceRoll <= 20:
            curRarity = "rare";
            break;
          case chanceRoll <= 55 && chanceRoll > 20:
            curRarity = "uncommon";
            break;
          case chanceRoll > 55:
            curRarity = "common";
            break;
          default:
            curRarity = "";
            break;
        }
        //Create filtered list of item indexes matching selected rarity
        let listFiltered = [];
        for (let i in fullList) {
          fullList[i].rarity === curRarity && listFiltered.push(i);
        }
        //The index of the item to be selected, taken from the full list
        let curItemIndex =
          listFiltered[Math.floor(Math.random() * listFiltered.length)];
        selectList.filter((mtx) => {
          if (mtx.name === fullList[curItemIndex].name) {
            mtx.count++;
          }
        });
        currVals = {
          iteration: i + 1,
          boxes: currVals.boxes,
          points: currVals.boxes * 30,
          found: [
            selectList.filter((mtx) => mtx.count >= 1).length,
            selectList.length,
          ],
          percent: (
            (selectList.filter((mtx) => mtx.count >= 1).length * 100) /
              currVals.boxes || 0
          ).toFixed(2),
        };
        if (
          selectList.filter((mtx) => mtx.count >= 1).length ===
            selectList.length ||
          (boxVal >= 1 && currVals.boxes === parseInt(boxVal))
        ) {
          let newList = boxCalcList;
          newList.unshift({
            iteration: i + 1,
            boxes: currVals.boxes,
            points: currVals.boxes * 30,
            found: [
              selectList.filter((mtx) => mtx.count >= 1).length,
              selectList.length,
            ],
            percent: (
              (selectList.filter((mtx) => mtx.count >= 1).length * 100) /
                currVals.boxes || 0
            ).toFixed(2),
          });
          setBoxCalcList(newList);
          currVals = {
            iteration: i + 2,
            boxes: 0,
            points: 0,
            found: [0, selectList.length],
            percent: 0,
          };
          for (let j in selectList) {
            selectList[j].count = 0;
          }
          i++;
        }
        setBoxCalcCurrent(currVals);
      }
    }
    dispatch(setSimRunning(false));
  };

  const calcItem = async () => {
    let fullList = JSON.parse(JSON.stringify(fullMTXList));
    let selectItem = itemSelected.value.item;
    selectItem.count = 0;
    let currVals = {
      iteration: 0,
      boxes: 0,
      points: 0,
      found: false,
      percent: 0,
    };
    for (let i = 0; i < iterations; ) {
      await sleep(10);
      if (!simRunning) {
        break;
      } else {
        currVals.boxes++;
        //Variable to store selected rarity of items to select from
        let curRarity;
        //Random number to decided rarity
        let chanceRoll = Math.floor(Math.random() * 100 + 1);
        //Weighted categories for deciding rarity
        switch (true) {
          case chanceRoll <= 20:
            curRarity = "rare";
            break;
          case chanceRoll <= 55 && chanceRoll > 20:
            curRarity = "uncommon";
            break;
          case chanceRoll > 55:
            curRarity = "common";
            break;
          default:
            curRarity = "";
            break;
        }
        //Create filtered list of item indexes matching selected rarity
        let listFiltered = [];
        for (let i in fullList) {
          fullList[i].rarity === curRarity && listFiltered.push(i);
        }
        //The index of the item to be selected, taken from the full list
        let curItemIndex =
          listFiltered[Math.floor(Math.random() * listFiltered.length)];
        if (selectItem.name === fullList[curItemIndex].name) {
          selectItem.count++;
        }
        currVals = {
          iteration: i + 1,
          boxes: currVals.boxes,
          points: currVals.boxes * 30,
          found: selectItem.count ? true : false,
          percent: ((selectItem.count * 100) / currVals.boxes || 0).toFixed(2),
        };
        if (
          selectItem.count ||
          (parseInt(boxVal) >= 1 && currVals.boxes === parseInt(boxVal))
        ) {
          let newList = itemCalcList;
          newList.unshift({
            iteration: i + 1,
            boxes: currVals.boxes,
            points: currVals.boxes * 30,
            found: selectItem.count ? true : false,
            percent: ((selectItem.count * 100) / currVals.boxes || 0).toFixed(
              2
            ),
          });
          setItemCalcList(newList);
          currVals = {
            iteration: i + 2,
            boxes: 0,
            points: 0,
            found: false,
            percent: 0,
          };
          selectItem.count = 0;
          i++;
        }
        setItemCalcCurrent(currVals);
      }
    }
    dispatch(setSimRunning(false));
  };

  return (
    <div
      className={`probabilitySim${
        simMode === "probability" ? "" : " hideContainer"
      }`}
    >
      {activeBox && (
        <div className="selectorContainer">
          <h4
            className={`boxSelector ${
              probFilter === "box" ? "activeFilter" : ""
            } ${simRunning ? "disabledContainer" : ""}`}
            onClick={() => setProbFilter("box")}
          >
            <img src={getBoxImage()} />
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
            maxLength="2"
            disabled={simRunning}
            onChange={(e) =>
              setIterations(
                e.target.value > 20 ? 20 : e.target.value.replace(/\D/, "")
              )
            }
            value={iterations}
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
            value={boxVal}
            placeholder="#"
            onPaste={(e) => e.preventDefault()}
          />
        </h4>
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
                  <td>{itemCalcCurrent.percent}%</td>
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
