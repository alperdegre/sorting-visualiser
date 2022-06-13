import { useMemo, useState } from "react";
import "./App.css";

const ANIMATION_DELAY = 20;

function App() {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const animationsArray = useMemo(() => {
    return [];
  }, []);

  const generateArrayHandler = (event) => {
    event.preventDefault();
    const newArray = Array.from({ length: 100 }, (x, i) => {
      return Math.floor(Math.random() * (100 - 5 + 1)) + 5;
    });
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
              items[index1].classList.add("sort-item-swap");
              items[index2].classList.add("sort-item-swap");
              break;
            case "CHANGE":
              items[index1].style.height = `${secondElement * 5}px`;
              items[index2].style.height = `${firstElement * 5}px`;
              break;
            case "NORMALIZE":
              items[index1].classList.remove("sort-item-swap");
              items[index2].classList.remove("sort-item-swap");
              break;
            default:
              break;
          }
        }, i * delay);
      }
    );

    setTimeout(() => {
      setArray(sortedArray);
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
        <button className="navbar-button" onClick={generateArrayHandler}>
          Generate New Array
        </button>
      </nav>
    </div>
  );
}

export default App;
