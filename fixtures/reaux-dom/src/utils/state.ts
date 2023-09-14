import {State as MainState} from "../module/main/type";
import {StateView} from "reaux-dom";

export interface AllState extends StateView {
    main: MainState;
}
