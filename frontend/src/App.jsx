import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./routes/Signup";
import ReporterSignup from "./routes/ReporterSignup";
import AuthorityReporter from "./routes/AuthorityReporter";
import Login from "./routes/Login";
import { ToastContainer } from "react-toastify";
import Layout from "./routes/Layout/Layout";
import Dashboard from "./routes/Admin/Dashboard";
import CountyList from "./routes/Admin/CountyList";
import AddCounty from "./routes/Admin/AddCounty";
import AddSubLocation from "./routes/Admin/AddSubLocation";
import SubLocationList from "./routes/Admin/SubLocationList";
import WardList from "./routes/Admin/WardList";
import AddWard from "./routes/Admin/AddWard";
import AddRole from "./routes/Admin/Roles/AddRole";
import RoleList from "./routes/Admin/Roles/RoleList";
import SubCountyAuthority from "./routes/Admin/SubCountyAuthority/SubCountyAuthority";
import SubCountyAuthorityList from "./routes/Admin/SubCountyAuthority/SubCountyAuthorityList";
import WardAuthorityList from "./routes/Admin/WardAuthrotiy/WardAuthorityList";
import WardAuthority from "./routes/Admin/WardAuthrotiy/WardAuthority";
import UserLayout from "./routes/UserLayout/UserLayout";
import UserDashboard from "./routes/User/Dashboard";
import ReportIncident from "./routes/ReportIncident";
import IncidentMap from "./routes/IncidentMap";
import IncidentHistory from "./routes/IncidentHistory";
import MapTest from "./routes/MapTest";
import Incidents from "./routes/Admin/Incidents/Incidents";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import Unauthorized from "./routes/Unauthorized";
import Profile from "./routes/Admin/Profile/Profile";
import UserProfile from "./routes/UserProfile";
import Chat from "./routes/Admin/Chat/Chat";
import UserChat from "./routes/Chat";
import AuthorityList from "./routes/Admin/AuthorityList";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MapTest />} />
        <Route
          path="/dashboard"
          element={
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          }
        />
        <Route
          path="/incident/report"
          element={
            <UserLayout>
              <ReportIncident />
            </UserLayout>
          }
        />
        <Route
          path="/incident/:anonymous/report"
          element={
            <UserLayout>
              <ReportIncident />
            </UserLayout>
          }
        />
        <Route
          path="/incident/map"
          element={
            <UserLayout>
              <IncidentMap />
            </UserLayout>
          }
        />
        <Route
          path="/incidents/history"
          element={
            <UserLayout>
              <IncidentHistory />
            </UserLayout>
          }
        />
        <Route
          path="/admin/ward-authority/all"
          element={
            <Layout>
              <WardAuthorityList />
            </Layout>
          }
        />
        <Route
          path="/admin/ward-authority/add"
          element={
            <Layout>
              <WardAuthority />
            </Layout>
          }
        />

<Route
          path="/admin/ward-authority/:editId/update"
          element={
            <Layout>
              <WardAuthority />
            </Layout>
          }
        />

        <Route
          path="/admin/subcounty-authority/all"
          element={
            <Layout>
              <SubCountyAuthorityList />
            </Layout>
          }
        />

        <Route
          path="/admin/subcounty-authority/add"
          element={
            <Layout>
              <SubCountyAuthority />
            </Layout>
          }
        />
        <Route
          path="/admin/:editId/sublocation/edit"
          element={
            <Layout>
              <SubCountyAuthority />
            </Layout>
          }
        />

        <Route
          path="/admin/roles/add"
          element={
            <Layout>
              <AddRole />
            </Layout>
          }
        />

        <Route
          path="/admin/roles"
          element={
            <Layout>
              <RoleList />
            </Layout>
          }
        />

        <Route
          path="/admin/authority/list"
          element={
            <Layout>
              <AuthorityList />
            </Layout>
          }
        />

        <Route
          path="/admin/:locationId/ward/add"
          element={
            <Layout>
              <AddWard />
            </Layout>
          }
        />

        <Route
          path="/admin/:locationId/wards"
          element={
            <Layout>
              <WardList />
            </Layout>
          }
        />

        <Route
          path="/admin/:countyId/sublocation/add"
          element={
            <Layout>
              <AddSubLocation />
            </Layout>
          }
        />
        <Route
          path="/admin/incident/map"
          element={
            <Layout>
              <IncidentMap />
            </Layout>
          }
        />

        <Route
          path="/admin/:countyId/sublocations"
          element={
            <Layout>
              <SubLocationList />
            </Layout>
          }
        />

        <Route
          path="/admin/counties/all"
          element={
            <Layout>
              <CountyList />
            </Layout>
          }
        />
        <Route
          path="/admin/county/add"
          element={
            <Layout>
              <AddCounty />
            </Layout>
          }
        />

        <Route
          path="/admin/incident/all"
          element={
            <Layout>
              <Incidents />
            </Layout>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/register/reporter/authority"
          element={<AuthorityReporter />}
        />

        <Route
          path="/user/profile"
          element={
            <UserLayout>
              <UserProfile />
            </UserLayout>
          }
        />
        <Route path="/authority/register" element={<Signup />} />

        <Route path="reporter/register" element={<ReporterSignup />} />

        <Route path="/login" element={<Login />} />

        {/* <Route path='/incidents/map' element={<IncidentsMap/>} /> */}

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/chat"
          element={
            <UserLayout>
              <UserChat />
            </UserLayout>
          }
        />

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "system-admin",
                "ward-admin",
                "ward-officer",
              ]}
            />
          }
        >
          <Route
            path="/admin/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />

          <Route
            path="/admin/chat"
            element={
              <Layout>
                <UserChat />
              </Layout>
            }
          />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
