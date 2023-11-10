import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    const dealinghand = await ApiCall({
        query: `
        query getAllDealingHand{
            getAllDealingHand{
              id,
              file_type,
              collector,
              dycollector,
              atp,
              jtp,
              je,
              fieldinspector,
              sitesupervisor,
              architectassistant,
              planningdraughtsman,
              spdraughtsman,
              stdraughtsman,
              landsupted,
              mamlatdar,
              dept1,
              dept2,
              dept3,
              dept4
            }
          }
      `,
        veriables: {}
    });
    return json({
        user: cookie,
        dealinghand: dealinghand.data.getAllDealingHand
    });
};



const Dealinghand = (): JSX.Element => {
    const dealinghand = useLoaderData().dealinghand;



    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        for (let i: number = 0; i < dealinghand.length; i++) {
            let dealinghanddata: { [key: string]: boolean } = {};
            for (const key in dealinghand[i]) {
                if (dealinghand[i].hasOwnProperty(key) && typeof dealinghand[i][key] === 'boolean') {
                    dealinghanddata[key] = dealinghand[i][key];
                }
            }
            setData((val) => [...val, dealinghanddata]);
        }
    }, []);


    const getvalue = (index: number) => {
        let dealinghanddata: { [key: string]: boolean } = {};
        for (const key in dealinghand[index]) {
            if (dealinghand[index].hasOwnProperty(key) && typeof dealinghand[index][key] === 'boolean') {
                dealinghanddata[key] = dealinghand[index][key];
            }
        }
        return dealinghanddata;
    }


    function compareObjects<T extends Record<string, unknown>>(obj1: T, obj2: T): boolean {
        const keys1 = Object.keys(obj1) as (keyof T)[];
        const keys2 = Object.keys(obj2) as (keyof T)[];

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }


    const submit = async (value: number, index: number) => {
        const update = await ApiCall({
            query: `
            mutation updateDealingHandById($updateDealinghandInput:UpdateDealinghandInput!){
                updateDealingHandById(updateDealinghandInput:$updateDealinghandInput){
                  id
                }
              }
          `,
            veriables: {
                updateDealinghandInput: {
                    id: value,
                    ...data[index]
                }
            }
        });
        if (update.status) {
            toast.success("Data updated sussufully", { theme: "light" })
            setTimeout(() => {
                window.location.reload();
            }, 800)

        } else {
            toast.error(update.message, { theme: "light" });
        }
    }

    const handleToggle = (index: number, key: string) => {
        setData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index][key] = !updatedData[index][key];
            return updatedData;
        });
    };
    return (
        <>
            <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Dealing Hand Approval System</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <div className="overflow-x-auto sm:mx-0.5 my-2 p-4">
                    <table className="min-w-full rounded-md">
                        <thead>
                            <tr className="rounded-md bg-[#0984e3] border-b border-t transition duration-300 ease-in-out">
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">id</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">File Type</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Collector</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Dy Collecotr</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">ATP</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">JTP</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">JE</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Field Inspector</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Site Supervisor</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Architect Assistant</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Planning Draughtsman</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Spdraughtsman</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Stdraughtsman</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Land suptd</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">Mamlatdar</th>
                                <th className="px-6 py-4 whitespace-nowrap font-medium text-white text-xl text-left">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length == 0 ? null : dealinghand.map((val: any, index: number) => {

                                return (
                                    <tr key={index} className="bg-white border-b border-t transition duration-300 ease-in-out hover:bg-gray-100">
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <p className="text-md font-semibold">{val.file_type}</p>
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].collector} onChange={(e) => { handleToggle(index, "collector"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].dycollector} onChange={(e) => { handleToggle(index, "dycollector"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].atp} onChange={(e) => { handleToggle(index, "atp"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].jtp} onChange={(e) => { handleToggle(index, "jtp"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].je} onChange={(e) => { handleToggle(index, "je"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].fieldinspector} onChange={(e) => { handleToggle(index, "fieldinspector"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].sitesupervisor} onChange={(e) => { handleToggle(index, "sitesupervisor"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].architectassistant} onChange={(e) => { handleToggle(index, "architectassistant"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].planningdraughtsman} onChange={(e) => { handleToggle(index, "planningdraughtsman"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].spdraughtsman} onChange={(e) => { handleToggle(index, "spdraughtsman"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].stdraughtsman} onChange={(e) => { handleToggle(index, "stdraughtsman"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].landsupted} onChange={(e) => { handleToggle(index, "landsupted"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" checked={data[index].mamlatdar} onChange={(e) => { handleToggle(index, "mamlatdar"); }} className="text-blue-600 bg-gray-100 border-gray-300 rounded scale-150" />
                                        </td>
                                        <td className="text-center text-lg text-gray-900 font-medium px-6 py-4 whitespace-nowrap">
                                            {compareObjects(data[index], getvalue(index)) ? null :
                                                <button onClick={() => { submit(val.id, index) }}
                                                    className="py-1 w-full sm:w-auto block text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
                                                >
                                                    UPDATE
                                                </button>
                                            }
                                        </td>

                                    </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default Dealinghand;