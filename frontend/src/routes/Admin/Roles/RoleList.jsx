import React, { useEffect, useState } from 'react'
import ActionSubmenu from '../../../components/ActionSubmenu/ActionSubmenu'
import { Link } from 'react-router-dom'
import Paginate from '../../../components/Paginate/Paginate'
import { FaPlus } from 'react-icons/fa'
import AuthLoader from '../../../components/preloaders/AuthLoader'
import Empty from '../../../components/Empty/Empty'
import { axiosInstance } from '../../../axios/axios'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { infoToast } from '../../../utils/toastMessage'
import { Helmet } from 'react-helmet-async'

const RoleList = () => {
  
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState([])
    const [pageCount,setPageCount] = useState()
    const [currentPage,setCurrentPage] = useState(1)
    const axiosPrivate = useAxiosPrivate();
    

    async function deleteHandler(itemId) {
      await axiosPrivate.delete(`/roles/${itemId}/delete`);
     
      
    
      setData(prev => {
        return prev?.filter(item => item.id !== itemId)
      });
      infoToast("Role removed");
     
      
    }

    function handlePageChange(selectedPage){
        setCurrentPage(selectedPage.selected + 1)
    }
    async function retrieveRoles(){
  try {
  
    setLoading(true)
    const {data}  = await axiosPrivate.get(`/roles?page=${currentPage}`)
    console.log(data);
    setData(data?.roles)
    setPageCount(data?.pageCount)
  } catch (error) {
    
  }finally{
  setLoading(false)
  }
    
    }
  
  
    useEffect(()=>{
  retrieveRoles()
    },[currentPage])
  
    return (
      <>
      <Helmet>
        <title>Admin | Roles</title>
      </Helmet>
      <div className="main-list">
      {/* <x-breadcrump :page="$page"/> */}
      <div className="main-list-container">
        <div className="admin-page-header">
          <div>
            <Link
              className="admin-nav-link"
              to={`/admin/roles/add`}
            >
              Add Role
              <FaPlus className="icon fas fa-plus ml-1 text-md"></FaPlus>
            </Link>
          </div>
        </div>
  
        <div className="table-container">
          <table
            className="a-list-table"
            style={{ width: "100%" }}
            id="listTable"
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
              <th scope="col" className="px-6 py-3 ">
                 Id
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Name
                </th>
  
                <th scope="col" className="px-6 py-3 ">
                Created At
                </th>
                
  
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
  
            {loading ? (
              <AuthLoader />
            ) : (
              // "data"
              <tbody>
                {data?.length > 0 ?data?.map((row, idx) => (
                  <tr
                    className={
                      twMerge("bg-white border-b dark:bg-gray-900 dark:border-gray-700 py-2",
                      idx % 2 === 0 ? "bg-white" : "even")
                    }
                  >
                    <td className="px-6 py-5 ">{row.id}</td>
  
                    <th
                      scope="row"
                      className="px-6 py-2 font-medium text-gray-900  dark:text-white"
                    >
                      {row.name}
                    </th>
                   
                   
  
                    <td className="px-6 py-4 ">
                      {/* {row?.createdAt} */}
  
                      {moment(row.createdAt).format("Do MMMM YYYY h:mm:A")}
                    </td>
  
                    <td className="px-6 py-2">
                      <ActionSubmenu key={idx}>
  
                       
                        {/* <li className="action-item">
                          <Link
                            to={`/admin/${row.id}/sublocations`}
                            className="submenu-link"
                          >
                         Edit Role
                          </Link>
                        </li> */}
                        
                        <li className="action-item">
                          <button
                            onClick={() => deleteHandler(row.id)}
                            id="delete-dcs-btn"
                            className="submenu-link"
                          >
                            Delete
                          </button>
                        </li>
                      </ActionSubmenu>
                    </td>
                  </tr>
                )): (
                  <Empty msg={'No record found'} span={5}/>
                )}
              </tbody>
            )}
          </table>
  
          {pageCount > 1 && <div className="py-5 pl-3">
            <Paginate
              pageCount={pageCount}
              handlePageChange={handlePageChange}
            />
          </div>}
        </div>
      </div>
    </div>
    </>
    )
  }

export default RoleList