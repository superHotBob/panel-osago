import {usePrevious} from "./usePrevious";

export const useCompare = value => {
    const prevValue = usePrevious(value)
    return prevValue !== value
}
