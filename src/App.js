import { useMemo, useState, useEffect } from "react";
import "./App.css";

const ANIMATION_DELAY = 2;

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

  const doAnimations = (animations, delay, sortedArray) => {
    setIsSorting(true);
    const items = document.getElementsByClassName("sort-item");
    animations.forEach(
      ([action, index1, index2, firstElement, secondElement], i) => {
        setTimeout(() => {
          switch (action) {
            case "HIGHLIGHT":
              if (
                items[index1].classList.contains("sort-item-set") ||
                items[index2].classList.contains("sort-item-set")
              ) {
                break;
              }
              items[index1].classList.add("sort-item-selected");
              items[index2].classList.add("sort-item-selected");
              break;
            case "CHANGE":
              items[index1].style.height = `${secondElement * 5}px`;
              items[index2].style.height = `${firstElement * 5}px`;
              break;
            case "NORMALIZE":
              if (
                items[index1].classList.contains("sort-item-set") ||
                items[index2].classList.contains("sort-item-set")
              ) {
                break;
              }
              items[index1].classList.remove("sort-item-selected");
              items[index2].classList.remove("sort-item-selected");
              break;
            case "SET":
              items[index1].classList.add("sort-item-set");
              break;
            default:
              break;
          }
        }, i * delay);
      }
    );

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
        <button className="navbar-button" onClick={generateArrayHandler}>
          Generate New Array
        </button>
      </nav>
    </div>
  );
}

export default App;
