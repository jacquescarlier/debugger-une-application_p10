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

  const filteredEvents = (
    (!type
      ? data?.events
      : data?.events) || []
  ).filter((event) => {
    if ((!type || event.type === type)) {
      return true;
    }
    return false;
  });

  // j'ai retiré l'utilisation de cette fonction qui pourtant optimise le code
  /* La méthode slice est utilisée pour extraire une partie du tableau filteredEvents pour la page actuelle. Voici une répartition des paramètres transmis à slice :
  L'indice de départ est calculé comme (currentPage - 1) * PER_PAGE. En effet, les indices de tableau sont de base zéro, donc si vous êtes sur la première page (currentPage vaut 1), vous voulez commencer à partir de l'index 0. Si vous êtes sur la deuxième page, vous voulez pour commencer à partir de l'index PER_PAGE, et ainsi de suite.
  L'indice de fin est calculé comme currentPage * PER_PAGE. Cela détermine où la tranche doit se terminer. Par exemple, si PER_PAGE vaut 10 et currentPage vaut 2, alors l'index de fin serait 20, ce qui signifie que vous souhaitez obtenir les éléments de l'index 10 à 19.
  */

  const typeList = new Set(data?.events.map((event) => event.type));
  const pageNumber = Math.ceil((filteredEvents?.length || 0) / PER_PAGE);
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
            {(filteredEvents.slice((currentPage - 1) * PER_PAGE,
              currentPage * PER_PAGE)).map((event) => (
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
