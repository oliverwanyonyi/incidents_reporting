// import './Layout/layout.css'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { axiosInstance } from "../../axios/axios";
import Empty from "../../components/Empty/Empty";
import ActionSubmenu from "../../components/ActionSubmenu/ActionSubmenu";
import AuthLoader from "../../components/preloaders/AuthLoader";
import Paginate from "../../components/Paginate/Paginate";
import moment from "moment";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { infoToast } from "../../utils/toastMessage";
const CountyList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const axiosPrivate = useAxiosPrivate();
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  async function deleteHandler(itemId) {
    await axiosPrivate.delete(`/counties/${itemId}/delete`);
   
    

    setData(prev => ({
      ...prev,
      counties: prev?.counties.filter(item => item.id !== itemId)
    }));
    infoToast("County Removed");
   
    
  }

  async function retrieveCounties() {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(`/counties?page=${currentPage}`);

      setData(data);
      setPageCount(data.pageCount);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    retrieveCounties();
  }, [currentPage]);
  return (
    <div className="main-list">
      {/* <x-breadcrump :page="$page"/> */}
      <div className="main-list-container">
        <div className="admin-page-header">
          <div>
            <Link className="admin-nav-link" to="/admin/county/add">
              Add County
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
                  {/* Id */}
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Code
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
                {data?.counties?.length > 0 ? (
                  data?.counties?.map((row, idx) => (
                    <tr
                      className={
                        ("bg-white border-b dark:bg-gray-900 dark:border-gray-700 py-2",
                        idx % 2 === 0 ? "bg-white" : "even")
                      }
                      key={idx}
                    >
                      <td className="px-6 py-5 ">{idx + 1}</td>

                      <th
                        scope="row"
                        className="px-6 py-2 font-medium text-gray-900  dark:text-white"
                      >
                        {row.name}
                      </th>
                      <td className="px-6 py-5 ">{row.code}</td>

                      <td className="px-6 py-4 ">
                        {/* {row.createdAt} */}

                        {moment(row.createdAt).format("Do MMMM YYYY h:mm:A")}
                      </td>

                      <td className="px-6 py-2">
                        <ActionSubmenu key={idx}>
                          {" "}
                          <li className="action-item">
                            <Link
                              to={`/admin/${row.id}/sublocation/add`}
                              className="submenu-link"
                            >
                              Add SubLocation
                            </Link>
                          </li>
                          <li className="action-item">
                            <Link
                              to={`/admin/${row.id}/sublocations`}
                              className="submenu-link"
                            >
                              View SubLocations
                            </Link>
                          </li>
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

export default CountyList;
