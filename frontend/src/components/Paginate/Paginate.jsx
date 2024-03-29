import  { useMemo } from 'react'
import ReactPaginate from 'react-paginate'
import './paginate.css'
const Paginate = ({pageCount,handlePageChange}) => {
    const paginateComponent = useMemo(()=>(
      <ReactPaginate
      previousLabel={'Previous'}
      nextLabel={'Next'}
      pageCount={pageCount }
      onPageChange={handlePageChange} 
      containerClassName='paginate-container'
      previousLinkClassName='page-link p-next-prev'
      nextLinkClassName='page-link p-next-prev'
      disabledLinkClassName='page-link page-disabled'
      pageLinkClassName='page-link'
      activeLinkClassName='page-link page-active' 
    />   
    ),[pageCount, handlePageChange])
  return paginateComponent
}

export default Paginate