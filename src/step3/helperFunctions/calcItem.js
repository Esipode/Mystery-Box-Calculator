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

const updateCurrVals = async (currVals, index, item, mode) => ({
  iteration: index + 1,
  boxes: currVals.boxes,
  points: currVals.boxes * price(mode),
  found: item.count ? true : false,
  percent: ((item.count * 100) / currVals.boxes || 0).toFixed(2),
})

const verifyFinishedIteration = async (item, boxVal, currVals) => {
  return item.count ||
    (parseInt(boxVal) >= 1 && currVals.boxes === parseInt(boxVal))
}

export default async function calcItem({ 
    fullMTXList, 
    iterations, 
    simRunning, 
    itemSelected, 
    boxVal, 
    itemCalcList, 
    setItemCalcList, 
    setItemCalcCurrent,
    mode, 
  }) {
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
    
    if (mode === 'new') {
      fullList = await setRanges(fullList);
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

        const { updatedList, updatedFullList } = await checkCount([{...selectItem}], fullList, itemIndex);

        if (!updatedFullList.filter((item) => item.count > 1).length || mode === 'old') {
          await sleep(25);
          currVals.boxes++;
          selectItem = [...updatedList][0];
          fullList = [...updatedFullList];
          currVals = await updateCurrVals(currVals, i, selectItem, mode);

          if (await verifyFinishedIteration(selectItem, boxVal, currVals)) {
            let newList = itemCalcList;
            newList.unshift({
              iteration: i + 1,
              boxes: currVals.boxes,
              points: currVals.boxes * price(mode),
              found: !!selectItem.count,
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
            for (let j in fullList) {
              fullList[j].count = 0;
            }
            i++;
          }
          setItemCalcCurrent(currVals);
        }
      }
    }
    return;
}