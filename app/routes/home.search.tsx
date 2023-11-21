import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const village = await ApiCall({
    query: `
        query getAllVillage{
            getAllVillage{
              id,
              name
            }
          }
      `,
    veriables: {},
  });

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

  return json({
    user: cookie,
    userdata: userdata.data.getUserById,
    village: village.data.getAllVillage,
  });
};

const Search: React.FC = (): JSX.Element => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const loader = useLoaderData();
  const village = loader.village;
  // const user = loader.user;
  const userdata = loader.userdata;
  console.log(userdata);

  const nameRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const villageRef = useRef<HTMLSelectElement>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const casetypeRef = useRef<HTMLSelectElement>(null);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchItems, setSearchItems] = useState<any[]>([]);

  const search = async () => {
    let res: { [key: string]: any } = { department: userdata.department };

    if (
      casetypeRef.current?.value != null &&
      casetypeRef.current?.value != undefined &&
      casetypeRef.current?.value != "" &&
      casetypeRef.current?.value != "0"
    ) {
      res.form_type = casetypeRef.current?.value;
    }
    if (
      villageRef.current?.value != null &&
      villageRef.current?.value != undefined &&
      villageRef.current?.value != "" &&
      villageRef.current?.value != "0"
    ) {
      res.village = villageRef.current?.value;
    }
    if (
      nameRef.current?.value != null &&
      nameRef.current?.value != undefined &&
      nameRef.current?.value != ""
    ) {
      res.name = nameRef.current?.value;
    }
    if (
      numberRef.current?.value != null &&
      numberRef.current?.value != undefined &&
      numberRef.current?.value != ""
    ) {
      res.number = numberRef.current?.value;
    }
    if (
      fromRef.current?.value != null &&
      fromRef.current?.value != undefined &&
      fromRef.current?.value != ""
    ) {
      res.form_id = parseInt(fromRef.current?.value);
    }

    const departmentdata = await ApiCall({
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
        searchCommonInput: res,
      },
    });
    if (departmentdata.status) {
      setIsSearch((val) => true);
      setSearchItems((val) => departmentdata.data.searchCommon);
    } else {
      toast.error(departmentdata.message, { theme: "light" });
    }
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
      <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
        <h1 className="text-gray-800 text-3xl font-semibold text-center">
          Search
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <div className="w-full grid place-items-center">
          <div className="w-96">
            <div className="w-full text-lg font-semibold  text-gray-700 text-left">
              Case Type
            </div>
            <select
              ref={casetypeRef}
              defaultValue={"0"}
              className="rounded-md bg-[#eeeeee] w-full outline-none fill-none text-slate-800 p-2 mt-2"
            >
              <option value="0" className="bg-white text-blakc text-lg">
                Select Case Type
              </option>

              {userdata.department == "PDA" ? (
                <>
                  <option
                    value="PETROLEUM"
                    className="bg-white text-blakc text-lg"
                  >
                    Petroleum
                  </option>
                  <option value="RTI" className="bg-white text-blakc text-lg">
                    RTI
                  </option>
                  <option value="ZONE" className="bg-white text-blakc text-lg">
                    ZONE
                  </option>
                  <option value="OC" className="bg-white text-blakc text-lg">
                    OC
                  </option>
                  <option value="CP" className="bg-white text-blakc text-lg">
                    CP
                  </option>
                  <option
                    value="PLINTH"
                    className="bg-white text-blakc text-lg"
                  >
                    PLINTH
                  </option>
                  <option
                    value="DEMOLITION"
                    className="bg-white text-blakc text-lg"
                  >
                    DEMOLITION
                  </option>
                  <option
                    value="OLDCOPY"
                    className="bg-white text-blakc text-lg"
                  >
                    OLDCOPY
                  </option>
                  <option
                    value="LANDRECORDS"
                    className="bg-white text-blakc text-lg"
                  >
                    LAND RECORDS
                  </option>
                  <option
                    value="UNAUTHORISED"
                    className="bg-white text-blakc text-lg"
                  >
                    UNAUTHORISED
                  </option>
                </>
              ) : null}

              {userdata.department == "PWD" ? (
                <>
                  <option
                    value="TEMPWATERCONNECT"
                    className="bg-white text-blakc text-lg"
                  >
                    Temporary Water Connection
                  </option>
                  <option
                    value="TEMPWATERDISCONNECT"
                    className="bg-white text-blakc text-lg"
                  >
                    Temporary Water Disconnection
                  </option>
                  <option
                    value="WATERSIZECHANGE"
                    className="bg-white text-blakc text-lg"
                  >
                    Water Size Change
                  </option>
                  <option
                    value="NEWWATERCONNECT"
                    className="bg-white text-blakc text-lg"
                  >
                    New Water Connection
                  </option>

                  <option
                    value="WATERRECONNECT"
                    className="bg-white text-blakc text-lg"
                  >
                    Water Reconnect
                  </option>
                  <option
                    value="PERMANENTWATERDISCONNECT"
                    className="bg-white text-blakc text-lg"
                  >
                    Permanent Water Disconnect
                  </option>
                </>
              ) : null}

              {userdata.department == "CRSR" ? (
                <>
                  <option
                    value="BIRTHCERT"
                    className="bg-white text-blakc text-lg"
                  >
                    Birth Cert
                  </option>
                  <option
                    value="BIRTHTEOR"
                    className="bg-white text-blakc text-lg"
                  >
                    Birth Teor
                  </option>
                  <option
                    value="DEATHCERT"
                    className="bg-white text-blakc text-lg"
                  >
                    Death Cert
                  </option>
                  <option
                    value="DEATHTEOR"
                    className="bg-white text-blakc text-lg"
                  >
                    Death Teor
                  </option>

                  <option
                    value="MARRIAGECERT"
                    className="bg-white text-blakc text-lg"
                  >
                    Marriage Cert
                  </option>
                  <option
                    value="MARRIAGETEOR"
                    className="bg-white text-blakc text-lg"
                  >
                    Marriage Teor{" "}
                  </option>
                  <option
                    value="MARRIAGEREGISTER"
                    className="bg-white text-blakc text-lg"
                  >
                    Marriage Register
                  </option>
                </>
              ) : null}
              {userdata.department == "DMC" ? (
                <>
                  <option
                    value="BIRTHREGISTER"
                    className="bg-white text-blakc text-lg"
                  >
                    Birth Register
                  </option>
                  <option
                    value="DEATHREGISTER"
                    className="bg-white text-blakc text-lg"
                  >
                    Death Register
                  </option>
                </>
              ) : null}
            </select>
          </div>
          <div className="bg-gray-300 w-full h-[1px] my-3"></div>
          <div className="w-96">
            <div className="w-full text-lg font-semibold  text-gray-700 text-left">
              Case number
            </div>
            <input
              ref={fromRef}
              placeholder="Case Number"
              className="rounded-md bg-[#eeeeee] w-full outline-none fill-none text-slate-800 p-2 mt-2"
            />
          </div>
          <div className="bg-gray-300 w-full h-[1px] my-3"></div>
          <div className="w-96">
            <div className="w-full text-lg font-semibold  text-gray-700 text-left">
              Applicant Name
            </div>
            <input
              ref={nameRef}
              placeholder="Applicant Name"
              className="rounded-md bg-[#eeeeee] w-full outline-none fill-none text-slate-800 p-2 mt-2"
            />
          </div>
          <div className="bg-gray-300 w-full h-[1px] my-3"></div>
          <div className="w-96">
            <div className="w-full text-lg font-semibold  text-gray-700 text-left">
              Mobile number
            </div>
            <input
              ref={numberRef}
              placeholder="Mobile number"
              className="rounded-md bg-[#eeeeee] w-full outline-none fill-none text-slate-800 p-2 mt-2"
            />
          </div>
          <div className="bg-gray-300 w-full h-[1px] my-3"></div>
          <div className="w-96">
            <div className="w-full text-lg font-semibold  text-gray-700 text-left">
              Applicant village
            </div>
            <select
              ref={villageRef}
              defaultValue={"0"}
              className="rounded-md bg-[#eeeeee] w-full outline-none fill-none text-slate-800 p-2 mt-2"
            >
              <option
                value="0"
                className="bg-white text-blakc text-lg"
                disabled
              >
                Select village
              </option>
              {village.map((val: any, index: number) => (
                <option
                  key={index}
                  value={val.name}
                  className="bg-white text-black text-lg"
                >
                  {val.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-96 mt-4">
            <button
              onClick={search}
              className="py-1 inline-block text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium w-full"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {isSearch ? (
        <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
          {searchItems == undefined ||
          searchItems.length == 0 ||
          searchItems == null ? (
            <h3 className="text-2xl font-semibold text-center bg-rose-500 bg-opacity-25 rounded-md border-l-4 border-rose-500 py-2  text-rose-500">
              You do not have any pending forms.
            </h3>
          ) : (
            <>
              {/* deparment section */}
              <div className="overflow-x-scroll overflow-y-visible sm:mx-0.5 my-2">
                <table className="min-w-full rounded-md">
                  <thead>
                    <tr className="rounded-md bg-[#0984e3] border-b border-t transition duration-300 ease-in-out">
                      <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">
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
                      <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchItems.map((val: any, index: number) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white border-b border-t transition duration-300 ease-in-out hover:bg-gray-100"
                        >
                          <td className="text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                            {val.form_id}
                          </td>
                          <td className="text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                            {val.form_type}
                          </td>
                          <td className="text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                            {val.name}
                          </td>
                          <td className="text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                            {val.village}
                          </td>
                          <td className="text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* deparment section */}
            </>
          )}
        </div>
      ) : null}
    </>
  );
};
export default Search;
