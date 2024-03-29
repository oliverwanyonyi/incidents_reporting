import React, { useEffect, useState } from "react";
import Empty from "../../components/Empty/Empty";
import Paginate from "../../components/Paginate/Paginate";
import { Link } from "react-router-dom";
import ActionSubmenu from "../../components/ActionSubmenu/ActionSubmenu";
import moment from "moment";
import AuthLoader from "../../components/preloaders/AuthLoader";
import { twMerge } from "tailwind-merge";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { successToast } from "../../utils/toastMessage";

const AuthorityList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const [fetchAgain,setFetchAgain] = useState(false)
  const axiosPrivate = useAxiosPrivate();

  function handlePageChange(selectedPage) {
    setCurrentPage(selectedPage.selected + 1);
  }


  async function handleAction(type, user){
    let message,user_id
    if(type === 'delete'){
        await axiosPrivate.delete(`/auth/user/${user}/delete`)
        message = "County Authority Deleted"
        user_id =user
    }else{
        await axiosPrivate.put(`/auth/user/${user.id}/activate`, {active: user.value})
        message = 'County Authority Updated'
        user_id = user.id
    }

    setData(prev => {
        if (type === "delete") {
          return prev.filter(item => item.id !== user_id);
        } else {
          return prev.map(item => {
            if (item.id === user_id) {
                
              return { ...item, active:user.value};
            } else {
              return item;
            }
          });
        }

      });
      
      successToast(message)
    
  }



  async function retrieveCounties() {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(
        `/counties/authorities/all?page=${currentPage}`
      );

      setData(data?.users);
      setPageCount(data?.pageCount);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    retrieveCounties();
  }, [currentPage, fetchAgain]);
  return (
    <div className="main-list">
      <div className="main-list-container">
        <div className="table-container">
          <table
            className="a-list-table"
            style={{ width: "100%" }}
            id="listTable"
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 ">
                  {/* Id */}
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Personal Details
                </th>

                <th scope="col" className="px-6 py-3 ">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Desgnation
                </th>
                <th scope="col" className="px-6 py-3 ">
                 Location
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
              <AuthLoader loadingMessage={"loading counties..."} />
            ) : (
              // "data"
              <tbody>
                {data?.length > 0 ? (
                  data?.map((row, idx) => (
                    <tr
                      className={twMerge(
                        "bg-white border-b dark:bg-gray-900 dark:border-gray-700 py-2",
                        idx % 2 === 0 ? "bg-white" : "even"
                      )}
                    >
                      <td className="px-6 py-5 ">{idx + 1}</td>

                      <th
                        scope="row"
                        className="px-6 py-2 font-medium text-gray-900  dark:text-white"
                      >
                        <p>Name: {row.full_name}</p> <br />
                        <br />
                        <p>Contact: {row.phone}</p> <br />
                        <br />
                        <p>Email: {row.email}</p> <br />
                        <br />
                      </th>

                      <td className="px-6 py-4 ">{row.ward_authority.position}</td>

                      <td className="px-6 py-4 ">{row.ward_authority.designation}</td>

                      <td className="px-6 py-4 "><>{`${row.county},  ${row.sub_county}, ${row.ward}`}</></td>

                      <td className="px-6 py-4 ">
                        {moment(row.createdAt).format("Do MMMM YYYY h:mm:A")}
                      </td>

                      <td className="px-6 py-2">
                        <ActionSubmenu key={idx}>
                       
                          <li className="action-item">
                            <button
                          
                              onClick={() =>
                                handleAction("enable", {
                                  id: row.id,
                                  value: row.active ? false : true,
                                })
                              }
                              id="delete-dcs-btn"
                              className="submenu-link"
                            >
                              {row?.active ? "Disable" : "Enable"}
                            </button>
                          </li>
                          <li className="action-item">
                            <button
                              onClick={() => handleAction("delete", row.id)}
                              id="delete-dcs-btn"
                              className="submenu-link"
                            >
                              Delete
                            </button>
                          </li>
                        </ActionSubmenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <Empty msg={"No record found"} span={5} />
                )}
              </tbody>
            )}
          </table>

          {pageCount > 1 && (
            <div className="py-5 pl-3">
              <Paginate
                pageCount={pageCount}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorityList;
