import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  console.log("data", data)
  console.log("type", type)

// filter events based on selected type
  const filteredEvents = (
    type
      ? data?.events.filter(event => event.type === type)
      : data?.events) || [];
 
                              console.log("filteredEvents", filteredEvents)
                              console.log("event.type", type)

// apply pagination on filtered events
// (1-1 * 9) à (1 * 9 ) va de 0 à 8 en page 1  ou de  9 à 18 en page 2
// ne devrais je pas faire de 0 à 8 et de 9 à 17, l'indice commence bien à 0

    const paginationEvents = filteredEvents.slice(
      (currentPage - 1) * PER_PAGE,
      currentPage * PER_PAGE
    );
                            console.log("current-page", currentPage)
                            console.log("paginationEvents", paginationEvents)
                            console.log("slice", filteredEvents.slice(
                              (currentPage - 1) * PER_PAGE,
                              currentPage * PER_PAGE
                            ))
// math.ceil retourne le plus petit entier supérieur ou égal au nombre donné
    const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);
// exemple pour soirée => 4/9 = 1, pour conférence 10/9 = 2
                            console.log("pageNumber",pageNumber)
                            console.log("filteredlength", filteredEvents.length)

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const typeList = new Set(data?.events.map((event) => event.type));
  
                            console.log("typeList", typeList)

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {paginationEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
