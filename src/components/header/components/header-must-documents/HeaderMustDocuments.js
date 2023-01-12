import React from 'react';
import './header-must-documents.scss';
import map from 'lodash/map';
import {HeaderLink} from "../header-link/HeaderLink";

const MUST_DOCUMENTS = [
    {name: 'Реквизиты MUST', href: 'https://drive.google.com/file/d/1wdDgIrejLWFavsxfIJmN_OcKVkPtrAb5/view'},
    {name: 'Лицензии партнеров MUST', href: ''},
    {name: 'Политика конфиденциальности', href: 'https://drive.google.com/file/d/129UAkUs3_KTcQsFllvzyKmGgdB3swaaY/view'},
    {name: 'Соглашение об использовании сайта', href: 'https://drive.google.com/file/d/12cJErv1BaIYLmvFXQ3Cp65Pq-Qj1cc2P/view'},
    {name: 'Согласие на обработку персональных данных', href: 'https://drive.google.com/file/d/11tHmEMsmYDbwki1TOlCjii4lfpgbQog1/view'}
]

export const HeaderMustDocuments = () => {
    return (
        <div className="header-must-documents">
            {map(MUST_DOCUMENTS, ({name, href}, key) => (
                <div className="header-must-documents__item" key={key}>
                    <HeaderLink name={name} href={href}/>
                </div>
            ))}
        </div>
    )

}
