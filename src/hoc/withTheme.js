import React from "react";

export const Theme = {
    MUST: 'must',
    E100: 'muste100',
    EL_POLIS: 'mustelpolis',
    DEMO: 'mustdemo',
    OBOZ: 'mustoboz',
    AGENT_BROKER: 'mustagentbroker',
    KUPLYU_POLIS: 'mustkuplyupolis',
    INFULL: 'mustinfull',
    POLIS_ONLINE: 'mustpolisonline',
    EUROGARANT: 'musteurogarant',
    GPN_REGION: 'gpnregion',
    KAMAZ: 'kamaz',
    IPOLIS: 'ipolis',
}

export const ThemeContext = React.createContext({
    theme: Theme.MUST
});

export const withTheme = (Component, theme = Theme.MUST, showPhoneInput) => () => {

    const className = 'theme-' + theme
    return (
        <ThemeContext.Provider value={{theme, showPhoneInput}}>
            <div className={className}>
                <Component/>
            </div>
        </ThemeContext.Provider>
    )
}
