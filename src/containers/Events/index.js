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

  const startIndex = (currentPage - 1) * PER_PAGE;
  const endIndex = currentPage * PER_PAGE;
  const filteredEvents = (
    (!type ? data?.events : data?.events) || []
  ).filter((event) => {
    if ((!type || event.type === type)) {
      return true;
    }
    return false;
  });
  /* La méthode slice est utilisée pour extraire une partie du tableau filteredEvents pour la page actuelle. Voici une répartition des paramètres transmis à slice :
  L'indice de départ est calculé comme (currentPage - 1) * PER_PAGE. En effet, les indices de tableau sont de base zéro, donc si vous êtes sur la première page (currentPage vaut 1), vous voulez commencer à partir de l'index 0. Si vous êtes sur la deuxième page, vous voulez pour commencer à partir de l'index PER_PAGE, et ainsi de suite.
  L'indice de fin est calculé comme currentPage * PER_PAGE. Cela détermine où la tranche doit se terminer. Par exemple, si PER_PAGE vaut 9 et currentPage vaut 2, alors l'index de fin serait 18, ce qui signifie que vous souhaitez obtenir les éléments de l'index 9 à 18.
  index de 0 à 9 par page = 9 éléments page 1 startIndex 0 endIndex 9
  page 2 start index 9 endIndex 18
  */
  const eventsForCurrentPage = filteredEvents.slice(startIndex, endIndex)
  const typeList = new Set(data?.events.map((event) => event.type));
  const numberOfPages = Math.ceil((filteredEvents?.length || 0) / PER_PAGE);
  // La fonction Math.ceil() retourne le plus petit entier supérieur ou égal au nombre donné. Plus facile à gérer dans notre cas que Math.floor
  // alors que La fonction Math.floor(x) renvoie le plus grand entier qui est inférieur ou égal à un nombre x.
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };
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
            {(eventsForCurrentPage).map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                    imageAlt={event.title} 
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(numberOfPages || 0)].map((_, n) => (
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
