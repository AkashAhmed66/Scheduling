import { useState } from "react";
import SidebarContext from "./SideBarContext";

export default function SidebarContextState (props) {
    const [state, setState] = useState([]);
    const update = (obj) => {
        setState(obj);
    }
    return (
        <SidebarContext.Provider value={{state, update}}>
            {props.children}
        </SidebarContext.Provider>

    );
}