import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactPaginate from 'react-paginate';

const Pagination = ({ current, pages, loadOnClick }) => {

  return (
    <ReactPaginate pageCount={pages} pageRangeDisplayed={3} marginPagesDisplayed={2}
      onPageChange={({ selected }) => loadOnClick(selected + 1)}
      initialPage={0}
      containerClassName="pagination"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      activeClassName="active zeroIndex"
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      previousClassName="page-item"
      nextClassName="page-item"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      nextLinkClassName="page-link"
      previousLinkClassName="page-link"
      disabledClassName="diabled"
      disableInitialCallback={true}
    />
  );
};

Pagination.propTypes = {
  current: PropTypes.number,
  pages: PropTypes.number,
  loadOnClick: PropTypes.func
};

export default Pagination;