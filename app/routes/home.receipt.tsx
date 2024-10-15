import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
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
import { formateDate } from "~/utils";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);

  const paymentdata = await ApiCall({
    query: `
            query getAllPaidPayment($department:String!){
	            getAllPaidPayment(department:$department){
		            id,
                form_type,
                form_id,
                paymentamout,
                orderid,
                bankreference,
                transactionid,
                paymentstatus,
                updatedAt,
                reconcilation,
                user{
                  name,
                  contact,
                }
	            }
            }
        `,
    veriables: {
      department: "BIRT",
    },
  });

  return json({
    user: cookie,
    payment: paymentdata.data.getAllPaidPayment,
  });
};

const Receipt: React.FC = (): JSX.Element => {
  const loader = useLoaderData();

  const user = loader.user;

  const navigator = useNavigate();

  const [recipt, setRecipt] = useState<unknown[]>([]);
  // const [department, setDepartment] = useState<unknown[]>([]);

  const pagination = usePagination(recipt);

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>();
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const init = () => {
    setRecipt((val) => loader.payment);
    if (user.role == "USER") {
      navigator("/home/services");
    }
  };

  useEffect(() => {
    init();
  }, []);

  const searchchange = () => {
    setIsSearching((val) => true);
    if (
      searchRef.current?.value == null ||
      searchRef.current?.value == undefined ||
      searchRef.current?.value == ""
    ) {
      setIsSearching((val) => false);
      return toast.error("Enter search keyword", { theme: "light" });
    }

    setRecipt(
      recipt.filter(
        (account: any) =>
          (account.user.name !== null ? account.user.name : "")
            .toString()
            .toLowerCase()
            .includes(
              searchRef.current?.value.toString().toLowerCase() ?? ""
            ) ||
          (account.user.contact !== null ? account.user.contact : "")
            .toString()
            .toLowerCase()
            .includes(
              searchRef.current?.value.toString().toLowerCase() ?? ""
            ) ||
          (account.paymentamout !== null ? account.paymentamout : "")
            .toString()
            .toLowerCase()
            .includes(
              searchRef.current?.value.toString().toLowerCase() ?? ""
            ) ||
          (account.form_type !== null ? account.form_type : "")
            .toString()
            .toLowerCase()
            .includes(searchRef.current?.value.toString().toLowerCase() ?? "")
      )
    );
    setIsSearch(true);
    setIsSearching(false);
  };

  const clearsearch = async () => {
    setIsSearch((val) => false);
    if (searchRef.current) {
      searchRef.current!.value = "";
    }
    const paymentdata = await ApiCall({
      query: `
              query getAllPaidPayment($department:String!){
                getAllPaidPayment(department:$department){
                  id,
                  form_type,
                  form_id,
                  paymentamout,
                  orderid,
                  bankreference,
                  transactionid,
                  paymentstatus,
                  updatedAt,
                  reconcilation,
                  user{
                    name,
                    contact,
                  }
                }
              }
          `,
      veriables: {
        department: "BIRT",
      },
    });

    setRecipt(paymentdata.data.getAllPaidPayment);
  };

  const [datebox, setDatebox] = useState<boolean>(false);

  const [id, setId] = useState<number>(0);

  const dateRef = useRef<HTMLInputElement>(null);

  const addRecoDate = async () => {
    const date = dateRef.current?.value;
    if (date == "" || date == null || date == undefined) {
      setDatebox((val) => false);
      return toast.error("Enter Reconciliation Date", { theme: "light" });
    }
    if (id == 0) {
      setDatebox((val) => false);
      return toast.error("Invalid Request", { theme: "light" });
    }

    const updateresponse = await ApiCall({
      query: `
             mutation updatePaymentById($updatePaymentInput:UpdatePaymentInput!){
              updatePaymentById(updatePaymentInput:$updatePaymentInput){
                id
              }
            }
            `,
      veriables: {
        updatePaymentInput: {
          id: id,
          reconcilation: date,
        },
      },
    });

    if (updateresponse.status) {
      setDatebox((val) => false);

      const paymentdata = await ApiCall({
        query: `
                query getAllPaidPayment($department:String!){
                  getAllPaidPayment(department:$department){
                    id,
                    form_type,
                    form_id,
                    paymentamout,
                    orderid,
                    bankreference,
                    transactionid,
                    paymentstatus,
                    updatedAt,
                    reconcilation,
                    user{
                      name,
                      contact,
                    }
                  }
                }
            `,
        veriables: {
          department: "BIRT",
        },
      });

      setRecipt(paymentdata.data.getAllPaidPayment);

      return toast.success("Reconciliation Date Added", { theme: "light" });
    } else {
      setDatebox((val) => false);
      return toast.error(updateresponse.message, { theme: "light" });
    }
  };

  return (
    <>
      {/* payment box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          datebox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-96">
          <h3 className="text-2xl text-center font-semibold">
            Add Reconciliation Date
          </h3>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>

          <input
            ref={dateRef}
            type="date"
            className="bg-[#eeeeee] rounded-md outline-none focus:outline-none py-1 px-4 w-full"
          />

          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={addRecoDate}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Submit
            </button>
            <button
              onClick={() => setDatebox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* payment box end here */}
      <div className="bg-white rounded-md shadow p-4 my-4 mb-10">
        <div className="flex items-center gap-2">
          <h1 className="text-gray-800 text-xl font-semibold text-center">
            Rent payment History
          </h1>
          <div className="grow"></div>
          {isSearch ? (
            <>
              <div className="grid place-items-center rounded-md bg-[#0984e3] shadow-md h-full p-2 text-white">
                Found : {recipt.length} result
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
                onClick={searchchange}
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
          <h3 className="text-2xl font-semibold text-center bg-rose-500 bg-opacity-25 rounded-md border-l-4 border-rose-500 py-2  text-rose-500 mt-4">
            You do not have any rceipt.
          </h3>
        ) : (
          <>
            {/* user section */}
            <div className="overflow-x-auto sm:mx-0.5 my-2">
              <table className="min-w-full rounded-md">
                <thead>
                  <tr className="bg-[#0984e3] border-b border-t transition duration-300 ease-in-out  rounded-xl">
                    <th className="bg-[#0984e3] rounded-l-md px-6 py-2 whitespace-nowrap font-medium text-white text-sm">
                      Purpose
                    </th>
                    <th className="px-6 py-2 whitespace-nowrap font-medium text-white text-sm">
                      Form Id
                    </th>
                    <th className="px-6 py-2 whitespace-nowrap font-medium text-white text-sm">
                      Applicant
                    </th>
                    <th className="px-6 py-2 whitespace-nowrap font-medium text-white text-sm">
                      Contact
                    </th>

                    <th className="px-6 py-2 whitespace-nowrap font-medium text-white text-sm">
                      Amount
                    </th>
                    <th className="px-6 py-2 whitespace-nowrap font-medium text-white text-sm">
                      Date
                    </th>
                    <th className="px-6 py-2 whitespace-nowrap font-medium text-white text-sm">
                      Action
                    </th>
                    <th className="bg-[#0984e3] rounded-r-md px-6 py-2 whitespace-nowrap font-medium text-white text-sm">
                      Reco Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((val: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b border-t transition duration-300 ease-in-out hover:bg-gray-100"
                      >
                        <td className="text-center text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap capitalize">
                          {val.form_type.charAt(0).toUpperCase() +
                            val.form_type.slice(1).toLowerCase()}
                        </td>
                        <td className="text-center text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap">
                          {val.form_id}
                        </td>
                        <td className="text-center text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap">
                          {val.user.name}
                        </td>
                        <td className="text-center text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap">
                          {val.user.contact}
                        </td>
                        <td className="text-center text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap">
                          {val.paymentamout}
                        </td>
                        <td className="text-center text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap">
                          {formateDate(new Date(val.updatedAt))}
                        </td>

                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap">
                          <Link
                            target="_blank"
                            to={`/home/receipt/genpdf/${val.form_id}/${val.form_type}`}
                            className="py-1 w-full sm:w-auto block text-white text-sm px-4 bg-[#0984e3] text-center rounded-md font-medium"
                          >
                            View Receipt
                          </Link>
                        </td>
                        <td className="text-sm text-gray-900 font-medium px-6 py-2 whitespace-nowrap text-center">
                          {val.reconcilation == null ||
                          val.reconcilation == undefined ||
                          val.reconcilation == "" ? (
                            <button
                              onClick={() => {
                                setId(val.id);
                                setDatebox((val) => true);
                              }}
                              className="py-1 w-full sm:w-auto block text-white text-sm px-4 bg-[#0984e3] text-center rounded-md font-medium"
                            >
                              Add Date
                            </button>
                          ) : (
                            formateDate(new Date(val.reconcilation))
                          )}
                        </td>
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

export default Receipt;
