import { useRouteMatch } from "react-router";
import { Switch, Route, NavLink } from 'react-router-dom';
import SpaceCraft from './SpaceCraft.js'
import "react-widgets/styles.css";
import './SpaceCraftList.css';
import Combobox from "react-widgets/Combobox";

var filteredSpaceData = []

async function getSpaceCraftByFamily(e) {
    let res = await fetch(`http://localhost:3001/spacecraft?family=${e}`);
    let data = await res.json();
    return data;
}

function SpaceCraftList({ spaceData, filteredSpaceData, setFilteredSpaceData, isFilteredSpace, setIsFilteredSpace}) {
    let match = useRouteMatch()

    async function handleSelect(e) {
        setIsFilteredSpace(true);
        filteredSpaceData = await (getSpaceCraftByFamily(e))
        setFilteredSpaceData(filteredSpaceData)
    }

    function resetFilter(){
        setIsFilteredSpace(false);
    }

    return (
        <div>
            <h1>
                Space Craft List
            </h1>
            <Combobox
                hideCaret
                hideEmptyPopup
                data={[...(new Set(spaceData.map((craft) => {
                    return craft.family
                })))]}
                placeholder="Search for a family of spacecraft!"
                onSelect={handleSelect}
            />
            <button onClick={resetFilter}>Reset Filter</button>
            <div>
                { isFilteredSpace?
                    filteredSpaceData.map((spaceData, index) => (
                        <NavLink className="NavLink" to={`${match.url}/${index}`} key={`nav${spaceData.id}`}>
                            {spaceData.name} {isFilteredSpace = false}
                        </NavLink>
                    )) :
                    spaceData.map((spaceData, index) => (
                        <NavLink className="NavLink" to={`${match.url}/${index}`} key={`nav${spaceData.id}`}>
                            {spaceData.name}
                        </NavLink>
                    ))
                }
            </div>
            <Switch>
                <Route path={`${match.path}/:spaceId`}>
                        <SpaceCraft spaceData={spaceData} key={spaceData.id} />
                </Route>
            </Switch>

        </div>
    );
}

export default SpaceCraftList;