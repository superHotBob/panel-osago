import { Theme } from "../../hoc/withTheme";

const common = {
    indicatorSeparator: () => ({
        display: 'none',
        opacity: 0
    }),
    placeholder: () => ({
        color: `#201F32`,
        margin: '0'
    }),
    dropdownIndicator: () => ({
        padding: 0,
        color: '#000',
        background: 'transparent'
    }),
    menuList: (provided) => ({
        ...provided,
        maxHeight: `296px`,
        borderRadius: '10px',
        padding: 0
    }),
    valueContainer: () => ({
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
    })
}

const getDefaultStyle = themeContext => {

    let primaryColor;

    switch (themeContext) {
        case Theme.GPN_REGION:
            primaryColor = '#0079C2';
        default:
            primaryColor = '#27B4B8';
    }


    return {
        control: () => ({
            display: 'flex',
            color: `#000`,
            background: `#fff`,
            fontSize: `18px`,
            fontWeight: 400,
            lineHeight: 1,
            borderRadius: '4px',
            padding: `13px 16px 12px 16px`,
            border: '1px solid #201F32',
        }),
        indicatorsContainer: () => ({
            width: '20px',
            display: 'flex',
            alignItems: 'center'
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 5,
            marginTop: `6px`,
            boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.1);',
            background: `#fff`,
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? primaryColor : '#000',
            background: `#fff`,
            fontSize: `18px`,
            fontWeight: 400,
            padding: '7px 16px',
            textAlign: 'left'
        }),
        ...common
    }
}

export default getDefaultStyle
