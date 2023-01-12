import React, {Fragment, Component} from 'react';
import ClickOutHandler from 'react-onclickout'
import './autocomplete.scss'
import {BemHelper, className} from "../../utils/class-helper";

const classes = new BemHelper({name: 'autocomplete'});

export default class AutoComplete extends Component {

    constructor(props) {
        super(props)

        this.state = {
            focused: false,
            focusedItemIndex: 0,
            chosen: !!this.props.value
        }

        this.inputRef = React.createRef();
        this.listArray = []
    }

    handleFocus = (focused) => {
        this.setState({
            focused
        })

        // if city wasn't selected from the list clear input value
        if (!focused) {
            if (!this.state.chosen) {
                this.props.onChange('')
            }
        }
    }

    scrollElIntoView = () => {
        if (document.body.contains(document.querySelector('.js-autocomplete-item--active'))) {
            document.querySelector('.js-autocomplete-item--active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.setState({chosen: true})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.defaultValue && this.props.defaultValue) {
            this.setState({chosen: true})
        }
    }

    onChoose = city => {
        this.props.onChoose(city)
        this.setState({
            focusedItemIndex: 0,
            chosen: true
        }, () => {
            this.inputRef.blur()
            this.handleFocus(false)
        })
    }

    render() {

        const {
            suggestions,
            onChange,
            value,
            disabled,
            error,
            keyToDisplay,
            limit = 5,
            placeholder,
            renderItem
        } = this.props
        const {focused, focusedItemIndex} = this.state

        return (
            <div {...classes(null, null, 'form-row')}>

                <ClickOutHandler onClickOut={() => {
                    if (this.state.focused) {
                        this.handleFocus(false)
                    }
                }}>
                    <label {...className('input-wrap')}>
                        <input value={value}
                               ref={c => {
                                   this.inputRef = c
                               }}
                               placeholder={placeholder || 'По паспорту'}
                               disabled={disabled}
                               autoComplete="off"
                               onFocus={() => {
                                   this.handleFocus(true)
                               }}
                               onKeyUp={(e) => {
                                   if (suggestions && suggestions.length) {

                                       const {focusedItemIndex} = this.state

                                       if (e.keyCode === 13) {
                                           const currentItem = suggestions[focusedItemIndex - 1]

                                           if (currentItem) {
                                               this.onChoose(currentItem)
                                           }

                                       } else if (e.keyCode === 38) {
                                           if (focusedItemIndex > 0) {
                                               this.setState({
                                                   focusedItemIndex: this.state.focusedItemIndex - 1
                                               }, () => {
                                                   this.scrollElIntoView()
                                               })

                                           }
                                       } else if (e.keyCode === 40) {
                                           if (focusedItemIndex <= limit) {
                                               this.setState({
                                                   focusedItemIndex: this.state.focusedItemIndex + 1
                                               }, () => {
                                                   this.scrollElIntoView()
                                               })
                                           }
                                       }
                                   }
                               }}
                               onChange={(e) => {
                                   this.setState({
                                       chosen: false
                                   })
                                   if (this.state.focusedItemIndex) {
                                       this.setState({
                                           focusedItemIndex: 0,
                                           chosen: false
                                       })
                                       this.listArray = []
                                   }
                                   onChange(e.currentTarget.value)
                               }}
                               {...className(['input', error ? 'input--error' : ''])}
                        />
                    </label>
                    {!!focused && value.trim().length ?
                        <div {...classes('list')}>
                            {suggestions && suggestions.length ?
                                <Fragment>
                                    {suggestions.map((cityItem, i) => {
                                        if (i > limit) {
                                            return null
                                        }
                                        return (
                                            <div {...classes('item', null, [focusedItemIndex === i + 1 ? 'mustins-autocomplete__item--active js-autocomplete-item--active' : ''])}
                                                 key={cityItem.fiasId || cityItem[keyToDisplay]}
                                                 onMouseEnter={() => {
                                                     this.setState({
                                                         focusedItemIndex: i + 1
                                                     })
                                                 }}
                                                 onClick={() => this.onChoose(cityItem)}>
                                                {renderItem ? renderItem(cityItem) : cityItem[keyToDisplay]}
                                            </div>
                                        )
                                    })}
                                </Fragment>
                                : <div {...classes('item-not-found')}>
                                    Ничего не найдено
                                </div>
                            }
                        </div>
                        : null
                    }
                </ClickOutHandler>
            </div>
        )
    }
}
