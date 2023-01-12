import React, {useCallback, useEffect, useState} from 'react';
import AutoComplete from "../insurance-form/AutoComplete";
import api from "../../api";
import {throttle} from "lodash/function";


const addressSuggestionApi = async (string) => {
    return await api(`/user/address/suggest?q=${string}`, 'POST', {})
}

const InputAddressAutoComplete = ({initialValue, onSelect, setError, disabled}) => {
    const [address, setAddress] = useState('')
    const [suggestions, setSuggestions] = useState([])

    const onChangeFilter = useCallback(throttle(async (addressString) => {
        const res = await addressSuggestionApi(addressString)
        const {suggestions} = await res.json()
        setSuggestions(suggestions || [])
    }, 300), [])

    const onChange = useCallback(addressString => {
        if (addressString !== initialValue) setError()
        setAddress(addressString)
    }, [])

    useEffect(() => {
        if (address) onChangeFilter(address)
    }, [address])

    useEffect(() => {
        setAddress(initialValue.fullAddress || '')
    }, [initialValue])

    return (
        <AutoComplete value={address || ''}
                      suggestions={suggestions}
                      disabled={disabled}
                      onChoose={onSelect}
                      onChange={onChange}
                      keyToDisplay='fullAddress'
        />
    );
};

InputAddressAutoComplete.defaultProps = {
    suggestions: [],
    onSelect: value => value,
}

export default InputAddressAutoComplete;
