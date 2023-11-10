import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { CilContact, CilEnvelopeClosed, Fa6SolidUser } from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    return json({
        user: cookie,
    });
};



const AddData: React.FC = (): JSX.Element => {
    const loader = useLoaderData();
    const user = loader.user;

    const navigator = useNavigate();


    const emailRef = useRef<HTMLInputElement>(null);
    const uidRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);

    const submit = async () => {
        const AddData = z
            .object({
                address: z
                    .string()
                    .nonempty("Applicant address is required."),
                email: z
                    .string()
                    .email("Enter a valid email.")
                    .nonempty("Enter Email id."),
                user_uid: z
                    .string()
                    .nonempty("Enter Aadhar Number."),
            })
            .strict();

        type AddData = z.infer<typeof AddData>;

        const userdata: AddData = {
            email: emailRef!.current!.value,
            user_uid: uidRef!.current!.value,
            address: addressRef!.current!.value,
        };

        const parsed = AddData.safeParse(userdata);
        if (parsed.success) {
            const data = await ApiCall({
                query: `
                mutation updateUserById($updateUserInput:UpdateUserInput!){
                    updateUserById(updateUserInput:$updateUserInput){
                        id,
                    }
                }
                `,
                veriables: {
                    updateUserInput: {
                        id: parseInt(user.id),
                        address: userdata.address,
                        email: userdata.email,
                        user_uid: userdata.user_uid
                    }
                },
            });
            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                navigator("/home");
            }
        } else {
            toast.error(parsed.error.errors[0].message, { theme: "light" });
        }
    };


    return (
        <>
            <div className="min-h-screen w-full bg-[#eeeeee] grid place-items-center">
                <div className="p-6 rounded-md shadow-md hover:shadow-xl hover:scale-105 transition-all bg-white border-t-4 border-purple-500 w-80">
                    <h1 className="text-gray-800 text-xl font-bold text-center">User Details</h1>
                    <p className="text-lg my-3 text-gray-700 text-center">Fill your relevant details.</p>


                    <p className="text-left text-sm font-medium text-black">Email</p>
                    <div className="bg-[#eeeeee] flex items-center rounded-md px-2 mt-1">
                        <div className="text-slate-800 font-bold text-sm mr-4">
                            <CilEnvelopeClosed></CilEnvelopeClosed>
                        </div>
                        <input
                            ref={emailRef}
                            placeholder="example@test.com"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 py-1 grow"
                        />
                    </div>
                    <p className="text-left text-sm font-medium text-black mt-3">Aadhar Number</p>
                    <div className="bg-[#eeeeee] px-2 flex items-center rounded-md mt-1">
                        <div className="text-slate-800 font-bold text-sm mr-4">
                            <CilContact></CilContact>
                        </div>
                        <input
                            ref={uidRef}
                            placeholder="Please type Aadhar number"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 py-1 grow"
                        />
                    </div>
                    <p className="text-left text-sm font-medium text-black mt-3">Address</p>
                    <div className="bg-[#eeeeee] p-2 flex items-center rounded-md mt-1">
                        <textarea
                            ref={addressRef}
                            placeholder="Address"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 grow resize-none h-20"
                        ></textarea>
                    </div>
                    <div className="flex gap-4 items-center mt-4">
                        <button onClick={submit} className="bg-[#0984e3] rounded-md py-1 text-sm text-center text-white font-semibold flex-1 inline-block">SUBMIT</button>
                        <Link to="/home" className="bg-blue-500 rounded-md py-1 text-sm text-center text-white font-semibold flex-1 inline-block">SKIP THIS STEP</Link>
                    </div>

                </div>
            </div>
        </>
    );
}
export default AddData;