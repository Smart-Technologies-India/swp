import { Link } from "@remix-run/react";
import { SVGProps } from "react";

const About: React.FC = (): JSX.Element => {
    return (
        <>
            <main className="bg-[#eeeeee] min-h-screen w-full pt-20">
                <div className="bg-[#2f3863] w-full py-4 flex px-6 items-center fixed top-0 left-0">
                    <h1 className="grow text-center text-white text-3xl font-semibold ">
                        About Page
                    </h1>
                    <Link to="/" className=" rounded-sm border-2 border-white  px-4 py-1 flex gap-4 font-semibold text-2xl text-white items-center">
                        <MaterialSymbolsOtherHousesRounded></MaterialSymbolsOtherHousesRounded> HOME
                    </Link>
                </div>
                <div className="p-4 mx-4 bg-white rounded-md my-6 border-l-4 border-[#2f3863] hover:shadow-lg">
                    <p className="text-black text-xl p-2 text-justify font-light">
                        The Planning and Development Authority Daman (PDA Daman) is a statutory body constituted under Section
                        20
                        Daman & Diu Town and Country Planning (Amendment) Regulation, 1999 (Principal Act- Goa, Daman and Diu
                        Town and
                        Country Planning Act, 1974) in the year 2012.
                    </p>
                    <p className="text-black text-xl p-2 text-justify font-light">
                        The whole area of Daman district (except area of designated reserved forests and area under the
                        Jurisdiction of Coast Guard Authority) has been declared as planning area under section 18 of the Act in
                        the
                        year 2011.
                    </p>
                </div>

                <div className="p-4 mx-4 bg-white rounded-md my-4 border-l-4 border-[#2f3863] hover:shadow-lg">
                    <h3 className="text-black text-3xl p-1 text-justify font-medium">
                        The Members of the Planning and Development Authority, Daman
                    </h3>
                    <div className="overflow-x-auto sm:mx-0.5 my-2">
                        <table className="min-w-full rounded-md">
                            <tbody>
                                <tr className="bg-white border-b border-t transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Chairman, PDA / The Hon’ble Collector, Daman/
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Shri Saurabh Mishra, IAS
                                    </td>

                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        The Member Secretary/ Deputy Collector (HQ)/SDM, Daman/ The Chief Town
                                        Planner
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Shri. Mohit Mishra, Danics
                                    </td>

                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        The President, Daman Municipal Council.
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Smt. Sonal I. Patel
                                    </td>
                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">4</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        The President, District Panchayat, Daman.
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Smt. Jagruti Kalpeshbhai Patel
                                    </td>

                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">5</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Expert Member
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Prof. Y.M. Desai, IIT Powai, Mumbai
                                    </td>
                                </tr>
                                <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">6</td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Expert Member
                                    </td>
                                    <td className="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                        Dr. B.K. Patel, B.E. (Civil), M.E. (Town & Regional Planning)
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className="p-4 mx-4 bg-white rounded-md my-4 border-l-4 border-[#2f3863] hover:shadow-lg">
                    <h3 className="text-black text-3xl p-1 text-justify font-medium">
                        Functions of PDA
                    </h3>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To prepare an Existing Land Use Map;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To prepare an Outline Development Plan;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To prepare a Comprehensive Development Plan;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To prepare and prescribe uses of land within its area;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To prepare schemes of development and undertake their implementation;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To carry out a survey in the planning area for the preparation of an Outline Development
                        Plan,
                        Comprehensive
                        Development Plan, or Town Planning Scheme;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To control the development activities in accordance with the development plan in the
                        planning
                        area;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To enter into contracts, agreements, or arrangements with any person or organization as
                        the
                        planning
                        development authority may seem necessary for performing its function;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To acquire, hold, manage and dispose of property, movable or immovable, as it may seem
                        necessary;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To execute works in connection with the supply of water, disposal of sewerage, and
                        provision of
                        other
                        services and amenities;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To prepare various schemes of infrastructure development and undertake their
                        implementation;
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To
                        prepare
                        development schemes and undertake their implementation, and for these purposes, it may
                        be
                        carried
                        out or cause to be carried out, surveys of the planning area and prepare report or
                        reports of
                        such
                        surveys, and to perform such other functions as may be prescribed.
                    </p>
                </div>



                <div className="p-4 mx-4 bg-white rounded-md my-4 border-l-4 border-[#2f3863] hover:shadow-lg">
                    <h3 className="text-black text-3xl p-1 text-justify font-medium">
                        Addition functions of the Authority
                    </h3>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To accord Construction Permission
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To accord Occupancy Certificate
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To accord Plinth Certificate
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        To accord Site Elevation Certificate
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        Survey regarding authorized and unauthorized construction and further necessary action
                        as per
                        the
                        development control rules.
                    </p>
                </div>
                <div className="p-4 mx-4 bg-white rounded-md my-4 border-l-4 border-[#2f3863] hover:shadow-lg">
                    <h3 className="text-black text-3xl p-1 text-justify font-medium">
                        Development Projects undertaken by the Authority
                    </h3>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        Work of Repair and Renovation of Khariwad Shopping Complex.
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        Development of Landmark and Beautification of Premises Beside Samudra Narayan Temple,
                        Near Fort
                        Area,
                        Nani
                        Daman.
                    </p>
                    <p className="font-normal text-xl">
                        <span className="text-[#2f3863]">&#x2756;</span>
                        Operation and Maintenance of Daman Recreational Club.
                    </p>
                </div>
            </main>
        </>
    );
}
export default About;


function MaterialSymbolsOtherHousesRounded(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 21q-.425 0-.713-.288T4 20v-8.375L3 12.4q-.35.275-.75.213T1.6 12.2q-.25-.35-.188-.75t.388-.65l9.6-7.325q.125-.1.275-.162T12 3.25q.175 0 .325.063t.275.162l9.625 7.325q.325.25.375.65t-.2.75q-.25.325-.65.375t-.725-.2L20 11.625V20q0 .425-.287.713T19 21H5Zm3-6q.425 0 .713-.288T9 14q0-.425-.288-.713T8 13q-.425 0-.713.288T7 14q0 .425.288.713T8 15Zm4 0q.425 0 .713-.288T13 14q0-.425-.288-.713T12 13q-.425 0-.713.288T11 14q0 .425.288.713T12 15Zm4 0q.425 0 .713-.288T17 14q0-.425-.288-.713T16 13q-.425 0-.713.288T15 14q0 .425.288.713T16 15Z"></path></svg>
    )
}