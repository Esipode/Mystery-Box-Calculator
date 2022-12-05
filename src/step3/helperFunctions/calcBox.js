import sleep from "./sleep";
import { 
	getRarity,
	filterList,
  setRanges,
  getRangeTotal,
  getIndex,
  price,
  checkCount,
} from './filterFuncs';

const updateCurrVals = async (currVals, index, list, mode) => ({
  iteration: index + 1,
  boxes: currVals.boxes,
  points: currVals.boxes * price(mode),
  found: [
    list.filter((mtx) => mtx.count >= 1).length,
    list.length,
  ],
  percent: (
    (list.filter((mtx) => mtx.count >= 1).length * 100) /
      currVals.boxes || 0
  ).toFixed(2),
})

const verifyFinishedIteration = async (list, boxVal, currVals) => {
  return list.filter((mtx) => mtx.count >= 1).length ===
    list.length || (boxVal >= 1 && currVals.boxes === parseInt(boxVal))
}

export default async function calcBox({ 
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
  }) {
	let fullList = mode === 'new' ? await setRanges([...fullMTXList]) : [...fullMTXList];
  let selectList = [...activeMTX];
  console.log({fullList, selectList})
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
    if (!simRunning) {
      break;
    } else {
      let itemIndex;
      //Old mode vars
      let curRarity;
      let listFiltered;
      //New mode vars
      let totalRange;
      let randomRange;

      if (mode === 'old') {
        curRarity = await getRarity();
        //Create filtered list of item indexes matching selected rarity
        listFiltered = await filterList(fullList, curRarity);
        //The index of the item to be selected, taken from the full list
        itemIndex = listFiltered[Math.floor(Math.random() * listFiltered.length)];
      }

      if (mode === 'new') {
        totalRange = await getRangeTotal(fullList);
        randomRange = Math.random() * totalRange;
        itemIndex = await getIndex(fullList, randomRange);
      }

      const selectedItemName = fullList?.[itemIndex]?.name;
      const isOwned = !!ownedList.filter((item) => (selectedItemName === item.name) && item.owned).length;
      const { updatedList, updatedFullList } = await checkCount(selectList, fullList, itemIndex);

      if ((!updatedFullList.filter((item) => item.count > 1).length && !isOwned) || mode === 'old') {
        await sleep(25);
        currVals.boxes++;
        selectList = [...updatedList];
        fullList = [...updatedFullList];
        currVals = await updateCurrVals(currVals, i, selectList, mode);

        if (await verifyFinishedIteration(selectList, boxVal, currVals)) {
          let newList = boxCalcList;
          newList.unshift(await updateCurrVals(currVals, i, selectList, mode));
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
          for (let j in fullList) {
            fullList[j].count = 0;
          }
          i++;
        }
        setBoxCalcCurrent(currVals);
      }
    }
  }
  return;
}
