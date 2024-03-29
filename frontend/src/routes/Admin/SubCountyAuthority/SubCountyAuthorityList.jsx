import { Link } from "react-router-dom";
import Paginate from "../../../components/Paginate/Paginate";
import ActionSubmenu from "../../../components/ActionSubmenu/ActionSubmenu";
import moment from "moment";
import AuthLoader from "../../../components/preloaders/AuthLoader";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import Empty from "../../../components/Empty/Empty";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { infoToast } from "../../../utils/toastMessage";

const SubCountyAuthorityList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const axiosPrivate = useAxiosPrivate();
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  async function retrieveData() {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get(
        `/counties/subcounty/authority/all?page=${currentPage}`
      );

      setData(data?.subcounty_authorities);
      setPageCount(data.pageCount);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function deleteHandler(itemId) {
    await axiosPrivate.delete(`/counties/subcounty/authority/${itemId}/delete`);

    setData((prev) => {
      return prev?.filter((item) => item.user_id !== itemId);
    });
    infoToast("Subcounty Authority Removed");
  }

  useEffect(() => {
    retrieveData();
  }, [currentPage]);

  return (
    <div className="main-list">
      {/* <x-breadcrump :page="$page"/> */}
      <div className="main-list-container">
        <div className="admin-page-header">
          <div>
            <Link
              className="admin-nav-link"
              to="/admin/subcounty-authority/add"
            >
              New Subcounty Authority
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
                  Authority Personal details
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Sub County
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Designation
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
                        {row.user.full_name}
                        <br />
                        <br />
                        {row.user.phone}
                        <br />
                        <br />
                        {row.user.email}
                        <br />
                      </th>
                      <td className="px-6 py-5 ">{row.sublocation.name}</td>
                      <td className="px-6 py-5 ">{row.user.position}</td>
                      <td className="px-6 py-5 ">{row.user.designation}</td>
                      <td className="px-6 py-4 ">
                        {/* {row.createdAt} */}

                        {moment(row.createdAt).format("Do MMMM YYYY h:mm:A")}
                      </td>

                      <td className="px-6 py-2">
                        <ActionSubmenu key={idx}>
                          {" "}
                          <li className="action-item">
                            <Link
                              to={`/admin/${row.user.id}/sublocation/edit`}
                              className="submenu-link"
                            >
                              Edit
                            </Link>
                          </li>
                          <li className="action-item">
                            <button
                              onClick={() => deleteHandler(row.user.id)}
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

export default SubCountyAuthorityList;
