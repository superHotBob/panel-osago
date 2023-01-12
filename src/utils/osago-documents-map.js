import {ORGANIZATION_TYPE_LEGAL, OsagoDocs, OsagoDocsData} from "../constants/osago";

const fakeDriverLicenseType = {
    id: OsagoDocs.driverLicenseFake,
    parentTypeId: 0,
    isRequired: true
}
const fakeDiagnosticCardType = {
    id: OsagoDocs.diagnosticCardFake,
    parentTypeId: 0,
    isRequired: true
}

export const osagoDocumentsMap = (types, previews, ownerType) => {
    // add fake driver license parent before drivers block start
    let newTypes = [...types, fakeDiagnosticCardType];
    if (ownerType !== ORGANIZATION_TYPE_LEGAL) {
        newTypes.push(fakeDriverLicenseType);
    }
    let mappedTypes = newTypes.map(type => {
        let additionalFields = {
            preview: null,
            order: 9999,
            view: 'unknown'
        }
        if (OsagoDocsData[type.id]) {
            additionalFields = {
                ...OsagoDocsData[type.id],
                preview: OsagoDocsData[type.id].preview ? previews[OsagoDocsData[type.id].preview] : null
            }
        }
        let parentTypeId = type.parentTypeId
        if (OsagoDocs.driverLicenseSection.includes(type.id)) {
            parentTypeId = OsagoDocs.driverLicenseFake
        } else if (OsagoDocs.diagnosticCard === type.id) {
            parentTypeId = OsagoDocs.diagnosticCardFake
        }

        return {
            ...type,
            parentTypeId,
            ...additionalFields
        }
    })
    mappedTypes.sort((type1, type2) => type1.order < type2.order ? -1 : (type1.order > type2.order ? 1 : 0))

    return mappedTypes
}

