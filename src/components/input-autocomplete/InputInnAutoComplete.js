import React, { useCallback, useEffect, useState } from "react";
import AutoComplete from "../insurance-form/AutoComplete";
import api from "../../api";
import { throttle } from "lodash/function";
import { isInnValid } from "../../validators/inn";
import filter from "lodash/filter";
import { Typography, TypographyColor, TypographyType } from "../typography/Typography";
import {className} from "../../utils/class-helper";

const innSuggestionApi = async (string) => {
    return await api(`/user/legal/suggest?inn=${string}`, "POST", {});
};

const InputInnAutoComplete = ({ initialValue, onSelect, setError, disabled, withDetail }) => {
    const [inn, setInn] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const onChangeFilter = useCallback(
        throttle(async (inn) => {
            if (isInnValid(inn)) {
                const res = await innSuggestionApi(inn);
                const { suggestions } = await res.json();
                const suggestionsWithKpp = filter(suggestions, (s) => !!s.kpp);
                setSuggestions(suggestionsWithKpp || []);
            }
        }, 300),
        []
    );

    const onChange = useCallback((inn) => {
        // if (inn !== initialValue) setError()
        setInn(inn);
    }, []);

    useEffect(() => {
        if (inn) onChangeFilter(inn);
    }, [inn]);

    useEffect(() => {
        setInn(initialValue?.inn || "");
    }, [initialValue]);

    if (withDetail) {
        return (
            <AutoComplete
                value={inn || ""}
                placeholder={"Введи ИНН организации"}
                suggestions={suggestions}
                disabled={disabled}
                onChoose={onSelect}
                onChange={onChange}
                keyToDisplay="kpp"
                renderItem={(item) => (
                    <div>
                        <div {...className(['mb-4', 'main-osago-form__organization-row'])}><Typography type={TypographyType.CAPTION} color={TypographyColor.MUST_900}>{item.title}</Typography></div>
                        <div {...className(['mb-4', 'main-osago-form__organization-row'])}>
                            <Typography type={TypographyType.CAPTION} color={TypographyColor.MUST_800}>{item.inn}</Typography>
                            <span {...className(['ml-8', 'mr-8'])}><Typography type={TypographyType.CAPTION} color={TypographyColor.MUST_800}>|</Typography></span>
                            <Typography type={TypographyType.CAPTION} color={TypographyColor.MUST_800}>КПП: {item.kpp}</Typography>
                        </div>
                    </div>
                )}
                limit={100}
            />
        );
    } else {
        return (
            <AutoComplete
                value={inn || ""}
                placeholder={"Введи ИНН организации"}
                suggestions={suggestions}
                disabled={disabled}
                onChoose={onSelect}
                onChange={onChange}
                keyToDisplay="kpp"
                renderItem={(item) => (
                    <div>
                        <div>{item.title}</div>
                        <div>КПП: {item.kpp}</div>
                    </div>
                )}
                limit={100}
            />
        );
    }

};

InputInnAutoComplete.defaultProps = {
    suggestions: [],
    onSelect: (value) => value,
};

export default InputInnAutoComplete;
