import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Fa6SolidMagnifyingGlass, Fa6SolidXmark } from "~/components/icons/icons";
import Pagination from "~/components/pagination";
import { userPrefs } from "~/cookies";
import { usePagination } from "~/hooks/usepagination";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie = await userPrefs.parse(cookieHeader);

    const departmentdata = await ApiCall({
        query: `
        query filterCommon($filterCommonInput:FilterCommonInput!){
            filterCommon(filterCommonInput:$filterCommonInput){
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
            filterCommonInput: {
                user_type: "DEPARTMENT",
                user_id: parseInt(cookie.id!),
                form_type: "UNAUTHORISED"
            }
        },
    });
    return json({
        user: cookie,
        department: departmentdata.data.filterCommon
    });
};
const Unauthorised: React.FC = (): JSX.Element => {
    const loader = useLoaderData();


    const [department, setDepartment] = useState<unknown[]>([]);

    const pagination = usePagination(department);

    const searchRef = useRef<HTMLInputElement>(null);
    const [isSearch, setIsSearch] = useState<boolean>();
    const [isSearching, setIsSearching] = useState<boolean>(false);


    const init = () => {
        setDepartment((val) => loader.department);
    }
    useEffect(() => {
        init();
    }, []);

    const search = async () => {
        setIsSearching((val) => true);
        if (searchRef.current?.value == null || searchRef.current?.value == undefined || searchRef.current?.value == "") {
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
                    name: searchRef.current?.value
                }
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
    }

    const clearsearch = async () => {
        setIsSearch((val) => false);
        init();
    }


    return (
        <>
            <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Unauthorised Construction</h1>
                <div className="flex items-center gap-2">
                    <h1 className="text-gray-800 text-3xl font-semibold text-center">Unauthorised Construction</h1>
                    <div className="grow"></div>
                    {
                        isSearch ?
                            <>
                                <div
                                    className="grid place-items-center rounded-md bg-[#0984e3] shadow-md h-full p-2 text-white">
                                    Found : {department.length} result
                                </div>
                                <button
                                    onClick={clearsearch}
                                    className="rounded-md bg-rose-500 shadow-md h-full p-2 text-white flex gap-2 items-center">
                                    <Fa6SolidXmark></Fa6SolidXmark> Clear
                                </button>
                            </>
                            :
                            isSearching ?
                                <div
                                    className="r rounded-md bg-[#0984e3] shadow-md h-full p-2 text-white flex gap-2 items-center">
                                    <Fa6SolidMagnifyingGlass></Fa6SolidMagnifyingGlass> Searching for text {searchRef.current?.value}
                                </div> :
                                <>
                                    <div className="grid place-items-center">
                                        <input ref={searchRef} type="text" className="bg-[#eeeeee] rounded-md outline-none focus:outline-none py-1 px-4" placeholder="Enter Search Text.." />
                                    </div>
                                    <button
                                        onClick={search}
                                        className="grid place-items-center rounded-md bg-[#0984e3] shadow-md h-full p-2 text-white">
                                        <Fa6SolidMagnifyingGlass></Fa6SolidMagnifyingGlass>
                                    </button>
                                </>
                    }
                </div>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                {(pagination.paginatedItems == undefined || pagination.paginatedItems.length == 0 || pagination.paginatedItems == null) ?
                    <h3 className="text-2xl font-semibold text-center bg-rose-500 bg-opacity-25 rounded-md border-l-4 border-rose-500 py-2  text-rose-500">You do not have any pending forms.</h3>
                    :
                    <>
                        {/* deparment section */}
                        <div className="overflow-x-scroll overflow-y-visible sm:mx-0.5 my-2">
                            <table className="min-w-full rounded-md">
                                <thead>
                                    <tr className="rounded-md bg-[#0984e3] border-b border-t transition duration-300 ease-in-out">
                                        <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Form Id</th>
                                        <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Purpose</th>
                                        <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Applicant</th>
                                        <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Village</th>
                                        <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl">Status</th>
                                        <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagination.paginatedItems.map((val: any, index: number) => {
                                        return (
                                            <tr key={index} className="bg-white border-b border-t transition duration-300 ease-in-out hover:bg-gray-100">
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

                                                    {val.query_status == "REJCTED" ?
                                                        <div
                                                            className="py-1 text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                                                        >
                                                            {val.query_status}
                                                        </div>
                                                        :
                                                        val.query_status == "INPROCESS" ?
                                                            <div
                                                                className="py-1 text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium"
                                                            >
                                                                {val.query_status}
                                                            </div>
                                                            :
                                                            val.query_status == "APPROVED" ?
                                                                <div
                                                                    className="py-1 text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                                                                >
                                                                    {val.query_status}
                                                                </div>
                                                                :
                                                                <div
                                                                    className="py-1 text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
                                                                >
                                                                    {val.query_status}
                                                                </div>
                                                    }
                                                </td>
                                                <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        className="py-1 w-full sm:w-auto block text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
                                                    >
                                                        VIEW
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* deparment section */}
                    </>}
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
}
export default Unauthorised;