import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtB.date) < new Date(evtA.date) ? -1 : 1
  );
  const nextCard = () => {
    setTimeout(
      () => setIndex(index >= byDateDesc.length - 1 ? 0 : index + 1),
      5000
    );
  };
  useEffect(() => {
    nextCard();
  });

  const generateKey = (index) => {
    return `${new Date().getTime}_${index} `
  }

console.log("data", data)
console.log("bydatadesc",byDateDesc)
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, id) => (
        <>
          <div
          data-id={event.date}
            key={event.date}
            className={`SlideCard SlideCard--${index === id ? "display" : "hide"
              }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((e, radioIdx) => (
                 <input
                    data-id={generateKey(radioIdx)}
                    key={generateKey(radioIdx)}
                    type="radio"
                    name="radio-button"
                    checked={index === radioIdx}
                  /> 
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;
