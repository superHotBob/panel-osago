import React from "react";
import ReactPaginate from 'react-paginate';
import "./pagination.scss";

export default ({ onPageChange, totalCount, pageElements }) => {
    const properties = {
        pageCount: totalCount / pageElements,
        marginPagesDisplayed: 1,
        initialPage: 0,
        containerClassName: "pagination",
        pageClassName: "page-link",
        onPageChange: onPageChange
    }
    return <>
        <ReactPaginate {...properties} />
    </>
};