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

// filter events based on selected type
  const filteredEvents = (
    type
      ? data?.events.filter(event => event.type === type)
      : data?.events) || [];
 
                              console.log("filtered", filteredEvents)
                              console.log("event.type", type)

// apply pagination on filtered events
    const paginationEvents = filteredEvents.slice(
      (currentPage - 1) * PER_PAGE,
      currentPage * PER_PAGE
    );
                            console.log("current-page", currentPage)
                            console.log("paginationEvents", filteredEvents.slice(
                            (currentPage - 1) * PER_PAGE,
                            currentPage * PER_PAGE
                            ))

    const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);

                            console.log("pageNumber",pageNumber)

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
