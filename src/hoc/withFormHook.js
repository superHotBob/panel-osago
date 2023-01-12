import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {size} from 'lodash'

export const withFormHook = (Component, validationFields = []) => {
    return props => {
        const {
            register,
            unregister,
            handleSubmit,
            setValue,
            setError,
            errors,
            triggerValidation,
            formState,
            clearError,
            getValues,
        } = useForm();

        const fields = []
        validationFields.forEach(name => fields.push(props[name]))

        const setValuesEffectHandler = name => {
            let validationValue = getValues(name) || ''
            let value = props[name] || ''
            if (value !== validationValue) {
                setTimeout(() => setValueAndClearError(name, value), 0)
            }
        }

        const isDirty = name => {
            return formState.dirtyFields.has(name)
        }

        const isFormValid = () => {
            return !size(errors)
        }

        const setValueAndClearError = (name, value) => {
            setValue(name, value)
            clearError(name)
        }

        const setValueAndValidate = async (name, value) => {
            setValue(name, value)
            await triggerValidation(name)
        }

        useEffect(
            () => validationFields.forEach(setValuesEffectHandler),
            fields
        );

        return (
            <Component
                {...props}
                unregister={unregister}
                register={register}
                handleSubmit={handleSubmit}
                setValue={setValue}
                setValuesEffectHandler={setValueAndClearError}
                setValueAndClearError={setValueAndClearError}
                setValueAndValidate={setValueAndValidate}
                isDirty={isDirty}
                isFormValid={isFormValid}
                errors={errors}
                triggerValidation={triggerValidation}
                getValues={getValues}
                setError={setError}
            />
        );
    }
}
