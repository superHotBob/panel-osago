import React, { useEffect, useRef } from 'react';

const useEffectWithSkipDidMount = (fn, deps, fnExit) => {
    const didMountRef = useRef(false);
    useEffect(() => {
        if (didMountRef.current) {
            fn();
        } else {
            didMountRef.current = true;
        }

        return () => fnExit && fnExit()
    }, deps);
};

export default useEffectWithSkipDidMount;
