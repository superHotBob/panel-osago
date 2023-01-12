import React from 'react';
import {Tabs} from "../../../tabs/Tabs";
import {Tab} from "../../../tabs/Tab";
import {OsagoDocs, OsagoDocsData} from "../../../../constants/osago";
import DocumentBlock from "./DocumentBlock";
import Document from "./Document";

const DocumentGroup = ({group}) => {

    // for single field like diagnostic card
    if (!group.parentTypeId &&
        group.children.length === 1 &&
        !group.children[0].children.length) {
        return (
            <DocumentBlock block={group}>
                {group.children.map(document => <Document document={document} />)}
            </DocumentBlock>
        )
    }

    if (group.view === 'tabs') {
        return (
            <DocumentBlock group={group}>
                <Tabs
                    skipInitialCallback
                    style='style-2'
                    active={vehicleDocumentTypeTab[group.id]}
                    onTabChange={tab => onTabChange(group.id, tab)}
                    onTabClick={tab => onTabClick(group.id, tab)}
                >
                    {[
                        <Tab key={OsagoDocs.sts} tabKey={OsagoDocs.sts} title={OsagoDocsData[OsagoDocs.sts].title}>
                            {group.children.map(block => block.children.map(document => <Document document={document} group={group} block={block} />))}
                        </Tab>,
                        <Tab key={OsagoDocs.pts} tabKey={OsagoDocs.pts} title={OsagoDocsData[OsagoDocs.pts].title}>
                            {group.children.map(block => block.children.map(document => <Document document={document} group={group} block={block} />))}
                        </Tab>
                    ]}
                </Tabs>
            </DocumentBlock>
        )
    }

    // if group is drivers render it as one block
    if (OsagoDocs.driverLicenseFake === group.id) {
        let driverLicenses = []
        group.children.forEach(block => driverLicenses.push(...block.children))
        return (
            <DocumentBlock group={group}>
                {driverLicenses.map(document => <Document document={document} group={group} />)}
            </DocumentBlock>
        )
    }

    return group.children.map(block => (
        <DocumentBlock block={block}>
            {block.children.map(document => <Document document={document} />)}
        </DocumentBlock>
    ))
};

export default DocumentGroup;
