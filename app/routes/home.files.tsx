import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Fa6SolidMagnifyingGlass,
  Fa6SolidXmark,
} from "~/components/icons/icons";
import Pagination from "~/components/pagination";
import { userPrefs } from "~/cookies";
import { usePagination } from "~/hooks/usepagination";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);

  const userdata = await ApiCall({
    query: `
        query getUserById($id:Int!){
            getUserById(id:$id){
                id,
                role,
                name,
                department
            }   
        }
        `,
    veriables: {
      id: parseInt(cookie.id!),
    },
  });

  const department = await ApiCall({
    query: `
        query filterCommonDepartment($filterDepartmentCommonInput:FilterDepartmentCommonInput!){
          filterCommonDepartment(filterDepartmentCommonInput:$filterDepartmentCommonInput){
                id,
                village,
                name,
                form_type,
                user_id,
                auth_user_id,
                focal_user_id,
                intra_user_id,
                inter_user_id,
                number,
                form_status,
                query_status,
                form_id
            }
          }
      `,
    veriables: {
      filterDepartmentCommonInput: {
        user_type: cookie.role == "USER" ? "USER" : "DEPARTMENT",
        user_id: parseInt(cookie.id!),
        department: userdata.data.getUserById.department,
      },
    },
  });

  return json({
    user: cookie,
    userdata: userdata.data.getUserById,
    department: department.data.filterCommonDepartment,
  });
};

const Dashboard: React.FC = (): JSX.Element => {
  const loader = useLoaderData();

  const user = loader.user;

  const navigator = useNavigate();

  const [department, setDepartment] = useState<unknown[]>([]);

  const pagination = usePagination(department);

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>();
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const init = () => {
    setDepartment((val) => loader.department);
    if (user.role == "USER") {
      if (
        loader.department == undefined ||
        loader.department.length == 0 ||
        loader.department == null
      )
        navigator("/home/services");
    }
  };
  useEffect(() => {
    init();
  }, []);

  const getUserfromId = (userid: number): string => {
    if (1 == userid) return "SYSTEM";
    if (2 == userid) return "ADMIN";
    if (3 == userid) return "Collector";
    if (4 == userid) return "Dy. Collector";
    if (5 == userid) return "ATP";
    if (6 == userid) return "JTP";
    if (7 == userid) return "JE";
    if (8 == userid) return "Field Inspector";
    if (9 == userid) return "Site Supervisor";
    if (10 == userid) return "Architect Assistant";
    if (11 == userid) return "Planning Draughtsman";
    if (12 == userid) return "SP Draughtsman";
    if (13 == userid) return "ST Draughtsman";
    if (14 == userid) return "Dept 1";
    if (15 == userid) return "Mamlatdar";
    if (16 == userid) return "EOCS";
    if (17 == userid) return "Dept 1";
    if (18 == userid) return "Dept 1";
    if (19 == userid) return "Dept 1";
    if (20 == userid) return "Dept 1";
    if (21 == userid) return "Suptd";
    if (22 == userid) return "Head Clerk";
    if (23 == userid) return "LDC";
    if (24 == userid) return "UDC";
    if (25 == userid) return "Dept 1";
    if (26 == userid) return "Dept 2";
    if (27 == userid) return "Dept 3";
    if (28 == userid) return "Dept 4";
    if (29 == userid) return "Dept 5";
    if (30 == userid) return "Dept 6";
    if (31 == userid) return "Suptd";
    if (32 == userid) return "Head Clerk";
    if (33 == userid) return "LDC";
    if (34 == userid) return "UDC";
    if (35 == userid) return "Dept 1";
    if (36 == userid) return "Dept 2";
    if (37 == userid) return "Dept 3";
    if (38 == userid) return "Dept 4";
    if (39 == userid) return "Dept 5";
    if (40 == userid) return "Dept 6";
    if (41 == userid) return "Suptd";
    if (42 == userid) return "Head Clerk";
    if (43 == userid) return "LDC";
    if (44 == userid) return "UDC";
    if (45 == userid) return "Dept 1";
    if (46 == userid) return "Dept 2";
    if (47 == userid) return "Dept 3";
    if (48 == userid) return "Dept 4";
    if (49 == userid) return "Dept 5";
    if (50 == userid) return "Dept 6";
    if (51 == userid) return "Suptd";
    if (52 == userid) return "Head Clerk";
    if (53 == userid) return "LDC";
    if (54 == userid) return "UDC";
    if (55 == userid) return "Dept 1";
    if (56 == userid) return "Dept 2";
    if (57 == userid) return "Dept 3";
    if (58 == userid) return "Dept 4";
    if (59 == userid) return "Dept 5";
    if (60 == userid) return "Dept 6";
    if (61 == userid) return "Suptd";
    if (62 == userid) return "Head Clerk";
    if (63 == userid) return "LDC";
    if (64 == userid) return "UDC";
    if (65 == userid) return "Dept 1";
    if (66 == userid) return "Dept 2";
    if (67 == userid) return "Dept 3";
    if (68 == userid) return "Dept 4";
    if (69 == userid) return "Dept 5";
    if (70 == userid) return "Dept 6";

    return "USER";
  };

  const search = async () => {
    setIsSearching((val) => true);
    if (
      searchRef.current?.value == null ||
      searchRef.current?.value == undefined ||
      searchRef.current?.value == ""
    ) {
      setIsSearching((val) => false);
      return toast.error("Enter search keyword", { theme: "light" });
    }

    const data = await ApiCall({
      query: `
            query searchCommon($searchCommonInput:SearchCommonInput!){
                searchCommon(searchCommonInput:$searchCommonInput){
                    id,
                    village,
                    name,
                    form_type,
                    user_id,
                    auth_user_id,
                    focal_user_id,
                    intra_user_id,
                    inter_user_id,
                    number,
                    form_status,
                    query_status,
                    form_id
                }
            }
            `,
      veriables: {
        searchCommonInput: {
          name: searchRef.current?.value,
        },
      },
    });
    if (!data.status) {
      setIsSearching((val) => false);
      return toast.error(data.message, { theme: "light" });
    } else {
      setIsSearching((val) => true);
      setIsSearch((val) => true);
      setDepartment(data.data.searchCommon);
    }
    setIsSearching((val) => false);
  };

  const clearsearch = async () => {
    setIsSearch((val) => false);
    init();
  };

  const getViewLink = (value: string, id: number): string => {
    if (value == "MARRIAGE") {
      return `/home/est/marriageview/${id}`;
    } else if (value == "RELIGIOUS") {
      return `/home/est/religiousview/${id}`;
    } else if (value == "ROADSHOW") {
      return `/home/est/roadshowview/${id}`;
    } else if (value == "GENERIC") {
      return `/home/est/genericview/${id}`;
    } else if (value == "PETROLEUM") {
      return `/home/pda/petroleumview/${id}`;
    } else if (value == "RTI") {
      return `/home/pda/rtiview/${id}`;
    } else if (value == "ZONE") {
      return `/home/pda/zoneinfoview/${id}`;
    } else if (value == "CP") {
      return `/home/pda/cpview/${id}`;
    } else if (value == "OC") {
      return `/home/pda/ocview/${id}`;
    } else if (value == "PLINTH") {
      return `/home/pda/plinthview/${id}`;
    } else if (value == "DEMOLITION") {
      return "/home";
    } else if (value == "OLDCOPY") {
      return `/home/pda/oldcopyview/${id}`;
    } else if (value == "LANDRECORDS") {
      return `/home/pda/landsection/${id}`;
    } else if (value == "MAMLATDAR") {
      return "/home";
    } else if (value == "OLDCOPY") {
      return `/home/pda/oldcopyview/${id}`;
    } else if (value == "LANDRECORDS") {
      return `/home/pda/landsection/${id}`;
    } else if (value == "DEATHREGISTER") {
      return `/home/dmc/newdeathregisterview/${id}`;
    } else if (value == "BIRTHREGISTER") {
      return `/home/dmc/newbirthregisterview/${id}`;
    } else if (value == "TEMPWATERCONNECT") {
      return `/home/pwd/tempwaterconnectview/${id}`;
    } else if (value == "TEMPWATERDISCONNECT") {
      return `/home/pwd/tempwaterdisconnectview/${id}`;
    } else if (value == "WATERSIZECHANGE") {
      return `/home/pwd/watersizechangeview/${id}`;
    } else if (value == "NEWWATERCONNECT") {
      return `/home/pwd/newwaterconnectview/${id}`;
    } else if (value == "WATERRECONNECT") {
      return `/home/pwd/waterreconnectview/${id}`;
    } else if (value == "PERMANENTWATERDISCONNECT") {
      return `/home/pwd/permanentwaterdisconnectview/${id}`;
    } else if (value == "BIRTHCERT") {
      return `/home/crsr/birthcertview/${id}`;
    } else if (value == "BIRTHTEOR") {
      return `/home/crsr/birthteorview/${id}`;
    } else if (value == "DEATHCERT") {
      return `/home/crsr/deathcertview/${id}`;
    } else if (value == "DEATHTEOR") {
      return `/home/crsr/deathteorview/${id}`;
    } else if (value == "MARRIAGECERT") {
      return `/home/crsr/marriagecertview/${id}`;
    } else if (value == "MARRIAGETEOR") {
      return `/home/crsr/marriageteorview/${id}`;
    } else if (value == "MARRIAGEREGISTER") {
      return `/home/crsr/newmarriageregisterview/${id}`;
    } else {
      return "/home";
    }
  };

  return (
    <>
      <div className="bg-white rounded-md shadow-lg p-4 my-4 mb-10">
        <div className="flex items-center gap-2">
          <h1 className="text-gray-800 text-3xl font-semibold text-center">
            {" "}
            {user.role == "USER" ? "Dashboard" : "Running Files"}
          </h1>
          <div className="grow"></div>
          {isSearch ? (
            <>
              <div className="grid place-items-center rounded-md bg-[#0984e3] shadow-md h-full p-2 text-white">
                Found : {department.length} result
              </div>
              <button
                onClick={clearsearch}
                className="rounded-md bg-rose-500 shadow-md h-full p-2 text-white flex gap-2 items-center"
              >
                <Fa6SolidXmark></Fa6SolidXmark> Clear
              </button>
            </>
          ) : isSearching ? (
            <div className="r rounded-md bg-[#0984e3] shadow-md h-full p-2 text-white flex gap-2 items-center">
              <Fa6SolidMagnifyingGlass></Fa6SolidMagnifyingGlass> Searching for
              text {searchRef.current?.value}
            </div>
          ) : (
            <>
              <div className="grid place-items-center">
                <input
                  ref={searchRef}
                  type="text"
                  className="bg-[#eeeeee] rounded-md outline-none focus:outline-none py-1 px-4"
                  placeholder="Enter Search Text.."
                />
              </div>
              <button
                onClick={search}
                className="grid place-items-center rounded-md bg-[#0984e3] shadow-md h-full p-2 text-white"
              >
                <Fa6SolidMagnifyingGlass></Fa6SolidMagnifyingGlass>
              </button>
            </>
          )}
        </div>

        {pagination.paginatedItems == undefined ||
        pagination.paginatedItems.length == 0 ||
        pagination.paginatedItems == null ? (
          <h3 className="text-2xl font-semibold text-center bg-rose-500 bg-opacity-25 rounded-md border-l-4 border-rose-500 py-2  text-rose-500">
            You do not have any pending forms.
          </h3>
        ) : (
          <>
            {/* user section */}
            <div className="overflow-x-auto sm:mx-0.5 my-2 p-4">
              <table className="min-w-full rounded-md">
                <thead>
                  <tr className="bg-[#0984e3] border-b border-t transition duration-300 ease-in-out  rounded-xl">
                    <th className="bg-[#0984e3] rounded-l-xl px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">
                      Form Id
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">
                      Purpose
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">
                      Applicant
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">
                      Village
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl">
                      Status
                    </th>
                    <th
                      className={`px-6 py-4 whitespace-nowrap font-medium text-white text-xl ${
                        user.role == "USER" ? "bg-[#0984e3] rounded-r-xl" : ""
                      } `}
                    >
                      ACTION
                    </th>
                    {user.role != "USER" ? (
                      <th className="bg-[#0984e3] rounded-r-xl px-6 py-4 whitespace-nowrap font-medium text-white text-xl">
                        With User
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((val: any, index: number) => {
                    // if (
                    //   userdata.department == "CRSR" &&
                    //   (val.form_type == "PETROLEUM" ||
                    //     val.form_type == "RTI" ||
                    //     val.form_type == "ZONE" ||
                    //     val.form_type == "DEMOLITION" ||
                    //     val.form_type == "OLDCOPY" ||
                    //     val.form_type == "LANDRECORDS" ||
                    //     val.form_type == "UNAUTHORISED" ||
                    //     val.form_type == "CP" ||
                    //     val.form_type == "OC" ||
                    //     val.form_type == "PLINTH" ||
                    //     val.form_type == "MARRIAGE" ||
                    //     val.form_type == "RELIGIOUS" ||
                    //     val.form_type == "ROADSHOW" ||
                    //     val.form_type == "GENERIC" ||
                    //     val.form_type == "BIRTHCERT" ||
                    //     val.form_type == "BIRTHTEOR" ||
                    //     val.form_type == "DEATHCERT" ||
                    //     val.form_type == "DEATHTEOR" ||
                    //     val.form_type == "MARRIAGECERT" ||
                    //     val.form_type == "MARRIAGETEOR" ||
                    //     val.form_type == "MARRIAGEREGISTER" ||
                    //     val.form_type == "TEMPWATERCONNECT" ||
                    //     val.form_type == "TEMPWATERDISCONNECT" ||
                    //     val.form_type == "WATERSIZECHANGE" ||
                    //     val.form_type == "NEWWATERCONNECT" ||
                    //     val.form_type == "WATERRECONNECT" ||
                    //     val.form_type == "PERMANENTWATERDISCONNECT" ||
                    //     val.form_type == "DEATHREGISTER" ||
                    //     val.form_type == "BIRTHREGISTER")
                    // )
                    //   return null;

                    return (
                      <tr
                        key={index}
                        className="bg-white border-b border-t transition duration-300 ease-in-out hover:bg-gray-100"
                      >
                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {val.form_id}
                        </td>
                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {val.form_type}
                        </td>

                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {val.name}
                        </td>
                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {val.village}
                        </td>
                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          {val.query_status == "REJCTED" ? (
                            <div className="py-1 text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium">
                              {val.query_status}
                            </div>
                          ) : val.query_status == "INPROCESS" ? (
                            <div className="py-1 text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium">
                              {val.query_status}
                            </div>
                          ) : val.query_status == "APPROVED" ? (
                            <div className="py-1 text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                              {val.query_status}
                            </div>
                          ) : val.query_status == "PAYMENT" ||
                            val.query_status == "QUERYRAISED" ||
                            val.query_status == "REJCTED" ? (
                            <div className="py-1 text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium">
                              {val.query_status}
                            </div>
                          ) : (
                            <div className="py-1 text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium">
                              {val.query_status}
                            </div>
                          )}
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                          <Link
                            to={getViewLink(val.form_type, val.form_id)}
                            className="py-1 w-full sm:w-auto block text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
                          >
                            VIEW
                          </Link>
                        </td>
                        {user.role != "USER" ? (
                          <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                            {getUserfromId(val.auth_user_id)}
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
        <Pagination
          ChangePerPage={pagination.ChangePerPage}
          activePage={pagination.activePage}
          changeActivePage={pagination.changeActivePage}
          firstPage={pagination.firstPage}
          getMaxPage={pagination.getMaxPage}
          getTotalItemsLength={pagination.getTotalItemsLength}
          goToPage={pagination.goToPage}
          itemPerPage={pagination.itemPerPage}
          lastPage={pagination.lastPage}
          nextPage={pagination.nextPage}
          paginatedItems={pagination.paginatedItems}
          prevPage={pagination.prevPage}
          totalPages={pagination.totalPages}
        ></Pagination>
      </div>
    </>
  );
};

export default Dashboard;
