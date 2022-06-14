import { useMemo, useState, useEffect } from "react";
import "./App.css";

const ANIMATION_DELAY = 10;

function App() {
  const [array, setArray] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const animationsArray = useMemo(() => {
    return [];
  }, []);

  const generateArrayHandler = (event) => {
    event.preventDefault();
    const newArray = Array.from({ length: 100 }, (x, i) => {
      return Math.floor(Math.random() * (100 - 5 + 1)) + 5;
    });
    const newArraySorted = [...newArray].sort((a, b) => a - b);
    const items = document.getElementsByClassName("sort-item");
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("sort-item-set");
    }
    setSortedArray(newArraySorted);
    setArray(newArray);
  };

  const bubbleSortHandler = (event) => {
    event.preventDefault();
    if (isSorting) return;
    const length = array.length;
    const newArray = Array.from(array);
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length - 1; j++) {
        if (newArray[j] > newArray[j + 1]) {
          animationsArray.push(["HIGHLIGHT", j, j + 1]);
          animationsArray.push(["NORMALIZE", j, j + 1]);
          animationsArray.push([
            "CHANGE",
            j,
            j + 1,
            newArray[j],
            newArray[j + 1],
          ]);
          const temp = newArray[j];
          newArray[j] = newArray[j + 1];
          newArray[j + 1] = temp;
        }
      }
      if (newArray[length - 1 - i] === sortedArray[length - 1 - i]) {
        animationsArray.push(["SET", length - 1 - i]);
      }
    }
    doAnimations(animationsArray, ANIMATION_DELAY, newArray);
  };

  const selectionSortHandler = (event) => {
    event.preventDefault();
    if (isSorting) return;
    const length = array.length;
    const newArray = Array.from(array);
    for (let i = 0; i < length; i++) {
      let min = i;
      for (let j = i + 1; j < length; j++) {
        animationsArray.push(["HIGHLIGHT", i, j]);
        animationsArray.push(["NORMALIZE", i, j]);
        if (newArray[j] < newArray[min]) {
          min = j;
        }
      }
      if (min !== i) {
        animationsArray.push(["HIGHLIGHT", i, min]);
        animationsArray.push(["NORMALIZE", i, min]);
        animationsArray.push(["CHANGE", i, min, newArray[i], newArray[min]]);
        const temp = newArray[i];
        newArray[i] = newArray[min];
        newArray[min] = temp;
      }
      animationsArray.push(["SET", i]);
    }

    doAnimations(animationsArray, ANIMATION_DELAY, newArray);
  };

  const insertionSortHandler = (event) => {
    event.preventDefault();
    if (isSorting) return;
    const length = array.length;
    const newArray = Array.from(array);
    for (let i = 1; i < length; i++) {
      let j = i;
      while (j > 0 && newArray[j] < newArray[j - 1]) {
        animationsArray.push(["HIGHLIGHT", j, j - 1]);
        animationsArray.push(["NORMALIZE", j, j - 1]);
        animationsArray.push([
          "CHANGE",
          j,
          j - 1,
          newArray[j],
          newArray[j - 1],
        ]);
        const temp = newArray[j];
        newArray[j] = newArray[j - 1];
        newArray[j - 1] = temp;
        j--;
      }
    }
    doAnimations(animationsArray, ANIMATION_DELAY, newArray);
  };

  const mergeSortHandler = (event) => {
    event.preventDefault();
    if (isSorting) return;
    const length = array.length;
    let newArray = Array.from(array);
    const mergeTwoArrays = (arr, left, right) => {
      if (left < right) {
        const middle = Math.floor((left + right) / 2);
        mergeTwoArrays(arr, left, middle);
        mergeTwoArrays(arr, middle + 1, right);
        merge(arr, left, middle, right);
      }
    };

    const merge = (arr, left, middle, right) => {
      let n1 = middle - left + 1;
      let n2 = right - middle;

      const leftArray = arr.slice(left, middle + 1);
      const rightArray = arr.slice(middle + 1, right + 1);

      let i = 0;
      let j = 0;
      let k = left;
      while (i < n1 && j < n2) {
        if (leftArray[i] <= rightArray[j]) {
          animationsArray.push(["HIGHLIGHT", [left, right, k]]);
          animationsArray.push(["NORMALIZE", [left, right, k]]);
          animationsArray.push(["CHANGE", [k], [leftArray[i]]]);
          console.log(leftArray[i]);
          arr[k] = leftArray[i];
          i++;
        } else {
          animationsArray.push(["HIGHLIGHT", [left, right, k]]);
          animationsArray.push(["NORMALIZE", [left, right, k]]);
          animationsArray.push(["CHANGE", [k], [rightArray[j]]]);
          arr[k] = rightArray[j];
          j++;
        }
        k++;
      }

      while (i < n1) {
        animationsArray.push(["CHANGE", [k], [leftArray[i]]]);
        arr[k] = leftArray[i];
        i++;
        k++;
      }

      while (j < n2) {
        animationsArray.push(["CHANGE", [k], [rightArray[j]]]);
        arr[k] = rightArray[j];
        j++;
        k++;
      }
    };
    mergeTwoArrays(newArray, 0, length - 1);

    doAnimations(animationsArray, ANIMATION_DELAY, newArray);
  };

  const doAnimations = (animations, delay, sortedArray) => {
    setIsSorting(true);
    const items = document.getElementsByClassName("sort-item");
    animations.forEach(([action, indexes, elements], i) => {
      setTimeout(() => {
        switch (action) {
          case "HIGHLIGHT":
            if (
              indexes.forEach((index) => {
                items[index].classList.contains("sort-item-set");
              })
            ) {
              break;
            }
            indexes.forEach((index) => {
              items[index].classList.add("sort-item-selected");
            });
            break;
          case "CHANGE":
            if (indexes.length === 2) {
              items[indexes[0]].style.height = `${elements[1] * 5}px`;
              items[indexes[1]].style.height = `${elements[0] * 5}px`;
            } else if (indexes.length === 1) {
              items[indexes[0]].style.height = `${elements[0] * 5}px`;
            }
            break;
          case "NORMALIZE":
            if (
              indexes.forEach((index) => {
                items[index].classList.contains("sort-item-set");
              })
            ) {
              break;
            }
            indexes.forEach((index) => {
              items[index].classList.remove("sort-item-selected");
            });
            break;
          case "SET":
            indexes.forEach((index) => {
              items[index].classList.add("sort-item-set");
            });
            break;
          default:
            break;
        }
      }, i * delay);
    });

    setTimeout(() => {
      setArray(sortedArray);
      animationsArray.length = 0;
      setIsSorting(false);
    }, animationsArray.length * ANIMATION_DELAY);
  };

  return (
    <div className="App">
      <div className="sort-frame">
        {array.map((item, index) => {
          return (
            <div
              key={index}
              className="sort-item"
              style={{ height: `${item * 5}px` }}
            ></div>
          );
        })}
      </div>
      <nav className="navbar">
        <button className="navbar-button" onClick={bubbleSortHandler}>
          Bubble Sort
        </button>
        <button className="navbar-button" onClick={selectionSortHandler}>
          Selection Sort
        </button>
        <button className="navbar-button" onClick={insertionSortHandler}>
          Insertion Sort
        </button>
        <button className="navbar-button" onClick={mergeSortHandler}>
          Merge Sort
        </button>
        <button className="navbar-button" onClick={generateArrayHandler}>
          Generate New Array
        </button>
      </nav>
    </div>
  );
}

export default App;
