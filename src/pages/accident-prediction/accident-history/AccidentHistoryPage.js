import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import map from 'lodash/map';
import {
    loadHistoryCardsAction,
    selectHistoryCards,
    selectPredictionId,
    selectHistoryCount,
} from "./AccidentHistoryPageModel";
import uuid from 'react-uuid';

import { Button } from "src/components/button/Button";

import { AccidentHistoryCard } from "./components/accident-history-card/AccidentHistoryCard";

import { AccidentFlow } from '../components/accident-flow/AccidentFlow';
import { AccidentLegend } from '../components/accident-legend/AccidentLegend';
import { startAccidentFlowAction } from '../components/accident-flow/AccidentFlowModel';
import { AccidentAddVehicle } from "../components/accident-add-vehicle/accident-add-vehicle";

import {
    Typography,
    TypographyType,
    TypographyWeight,
    TypographyColor
} from "../../../components/typography/Typography";
import Pagination from "../../../components/pagination";
import { Sprite } from '../../../components/sprite/Sprite';
import {selectAuthUser, selectAuthUserVehicleLimitIsReached} from '../../../redux/authReducer';
import { SubHeader } from "../../../components/sub-header/sub-header";
import { AddTrack, CustomEventName } from '../../../modules/tracking';
import { IconName, IconSprite } from '../../../components/icon-sprite/IconSprite';
import { MustBasedTechnology } from '../../../components/must-based-technology/must-based-technology';

import './accident-history-page.scss';
import {AccidentPricingPlansModal} from "src/pages/accident-prediction/accident-history/components/accident-pricing-plans-modal/AccidentPricingPlansModal";
import {useFilledData} from "../../../hooks/useFilledData";

export const AccidentHistoryPage = (group) => {
    const user = useSelector(selectAuthUser);
    const totalCount = useSelector(selectHistoryCount);
    const predictionId = useSelector(selectPredictionId);
    const historyCards = useSelector(selectHistoryCards);
    const { isLoggedIn } = useSelector(state => state.Auth);
    const isAvailableFreeSubs = useSelector(selectAuthUserVehicleLimitIsReached);
    const isNeedRedirect = useFilledData();

    const dispatch = useDispatch();

    const [pageElements] = useState(6);
    const [page, setPage] = useState(0);
    const [active, setActive] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const pageTitle = active === 'my_vehicles' ? 'Мои автомобили' : 'История запросов';

    const handleCheckMoreClick = (e) => {
        if (!user.bornOn) {
            dispatch(startAccidentFlowAction(predictionId));
            e.stopPropagation();
            e.preventDefault();
        }
    };
    const setLoadingFunc = (status) => {
        setLoading(status);
    };

    const onPageChange = (e) => {
        const newPage = Number(e.selected);
        setPage(newPage);
    };

    useEffect(() => {
        setActive(window.location.pathname.substring(1));
    }, [])

    useEffect(() => {
        if(isNeedRedirect) {
            // window.location.href = '/?showRegistration'
        }
    }, [isNeedRedirect])

    useEffect(() => {
        setLoadingFunc(true);
        dispatch(loadHistoryCardsAction(page + 1, pageElements, group, true, setLoadingFunc));
        window.scrollTo(0, 0);
    }, [page]);

    useEffect(() => {
        if (!isLoggedIn && window.location.pathname !== '/') {
            window.location.href = '/'
        }
    }, [isLoggedIn]);

    const renderHistoryCards = () => {
        return map(historyCards, historyCard => {
            const id = uuid();
            return <AccidentHistoryCard key={id} uuid={id} historyCard={historyCard} />
        });
    };

    const renderAddBlock = () => {
        return isAvailableFreeSubs && (
            <div className="accident-history-page__more-vehicles mustins-mt-12">
                <div className='mustins-mb-16'>
                    <Typography
                        className='mustins-mb-16'
                        type={TypographyType.H5}
                        weight={TypographyWeight.BOLD}
                    >
                        Достигнут лимит бесплатных авто
                    </Typography>
                </div>

                <div className='mustins-mb-28'>
                    <Typography
                        type={TypographyType.CAPTION}
                        weight={TypographyWeight.REGULAR}
                        color={TypographyColor.MUST_800}
                    >
                        Чтобы добавить больше автомобилей,
                        <br />
                        перейди на тариф выше
                    </Typography>
                </div>

                <Button onClick={() => setOpen(true)}>
                    Больше авто
                </Button>
            </div>
        )
    }

    return (
        <>
            <SubHeader />
            {historyCards && <>
                {historyCards.length > 0
                    ? <>
                        <div className="accident-history-page">
                            <div className="accident-history-page__header">
                                <div className="accident-history-page__header-data">
                                    <div className="accident-history-page__title">
                                        <Typography type={TypographyType.H2}>{pageTitle}</Typography>
                                    </div>
                                    <div className="accident-history-page__header-data-content">
                                        <div className="accident-history-page__sub-title">
                                            <Typography type={TypographyType.BODY}>
                                                Результат расчета вероятности ДТП для твоих грузовиков
                                                </Typography>
                                        </div>
                                        <div className="accident-history-page__legend">
                                            <AccidentLegend />
                                        </div>
                                        <div className="accident-history-page__page-links">
                                            {isAvailableFreeSubs ? (
                                                <button
                                                    onClick={() => setOpen(true)}
                                                    className="accident-history-page__add-subscription">
                                                    <IconSprite
                                                        name={IconName.CIRKLE_PLUS}
                                                        className="accident-history-page__page-link-icon"
                                                    />
                                                    <Typography type={TypographyType.CAPTION}>Добавить авто</Typography>
                                                </button>
                                            ) : (
                                                <a
                                                    className="accident-history-page__page-link"
                                                    href="/add_vehicle"
                                                    onClick={() => void AddTrack(CustomEventName.ADD_CAR)}>
                                                    <IconSprite
                                                        name={IconName.CIRKLE_PLUS}
                                                        className="accident-history-page__page-link-icon"
                                                    />
                                                    <Typography type={TypographyType.CAPTION}>Добавить авто</Typography>
                                                </a>
                                            )}

                                            {group && (
                                                <a
                                                    className="accident-history-page__page-link"
                                                    href={"/my_history"}
                                                    onClick={() => void AddTrack(CustomEventName.REQUEST_HISTORY)}>
                                                    <IconSprite
                                                        name={IconName.CIRKLE_TIME}
                                                        className="accident-history-page__page-link-icon"
                                                    />
                                                    <Typography type={TypographyType.CAPTION}>
                                                        История запросов
                                                    </Typography>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div>
                                {!loading && renderHistoryCards()}
                            </div>

                            {renderAddBlock()}

                            <Pagination
                                onPageChange={onPageChange}
                                totalCount={totalCount}
                                pageElements={pageElements}
                            />
                            <MustBasedTechnology />
                        </div>
                        <AccidentFlow />
                    </>
                    : (
                        <AccidentAddVehicle
                            title={pageTitle}
                            subTitle={
                                <>
                                    <span>Здесь будет история твоих запросов оценки вероятности ДТП.</span>
                                    <br />
                                    <span>Введи данные грузовика для начала оценки!</span>
                                </>
                            }
                        />
                    )
                }
            </>
            }
            <Sprite />

            <AccidentPricingPlansModal
                isOpen={isOpen}
                setOpen={setOpen}
            />

        </>
    )
}
