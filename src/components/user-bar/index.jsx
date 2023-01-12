import React, {Component} from 'react';
import {bool, func} from 'prop-types';
import cn from 'classnames';

import Registration from 'components/registration';
import ProfileBtn from 'components/profile-btn';
import ArrowLink from 'components/arrow-link';

import './user-bar.scss';
import {selectAuth} from "../../redux/authReducer";
import {connect} from "react-redux";
import {NavLink} from 'react-router-dom';

class UserBar extends Component {

    static propTypes = {
        onLinkClick: func,
        accidentMode: bool
    }

    static defaultProps = {
        onLinkClick() {

        }
    }

    state = {
        isShowPopup: false,
    };

    showRegistrationPopup = () => {
        this.setState({
            isShowPopup: true,
        });
        this.props.onLinkClick()
    };

    onPopupClose = (currentStatus) => {
        if (!currentStatus) {
            this.setState({
                isShowPopup: false,
            });
        }
    };

    render() {
        const {isMobile = false, onLinkClick, accidentMode} = this.props;

        return (
                <div className="user-bar">
                    <div className="user-bar__wrapper">
                        <div className="user-bar__inner">

                            <div className="user-bar__nav">
                                {accidentMode &&
                                <ul className="user-bar__nav-list">
                                    <li className="user-bar__nav-item">
                                        <NavLink exact
                                                 onClick={onLinkClick}
                                                 to="/"
                                                 className="user-bar__nav-link"
                                                 activeClassName="user-bar__nav-link_active"
                                        >Главная</NavLink>
                                    </li>
                                    <li className="user-bar__nav-item">
                                        {
                                            this.props.isLoggedIn
                                                    ? (
                                                            <NavLink
                                                                    exact
                                                                    onClick={onLinkClick}
                                                                    to='/history'
                                                                    className="user-bar__nav-link"
                                                                    activeClassName="user-bar__nav-link_active"
                                                            >История запросов вероятности ДТП</NavLink>
                                                    )
                                                    : (
                                                            <a
                                                                    href="#"
                                                                    className="user-bar__nav-link"
                                                                    onClick={this.showRegistrationPopup}
                                                            >История запросов вероятности ДТП</a>
                                                    )
                                        }
                                    </li>
                                </ul>}
                            </div>
                            <div
                                    className={cn(
                                            'user-bar__user',
                                            {'user-bar__user_mobile': isMobile}
                                    )}
                            >
                                <div className="user-bar__user-list">
                                    {
                                        !this.props.isLoggedIn
                                                ? <div className="user-bar__user-item">
                                                    <Registration
                                                            shortMode={this.props.accidentMode}
                                                            onClose={this.onPopupClose}
                                                    />
                                                </div>
                                                : <div className="user-bar__user-item user-bar__user-item_mobile">
                                                    <ArrowLink href="/profile">Мой профиль</ArrowLink>
                                                </div>
                                    }

                                    <div className="user-bar__user-item">
                                        <ProfileBtn/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = state => selectAuth(state)

export default connect(mapStateToProps)(UserBar)
