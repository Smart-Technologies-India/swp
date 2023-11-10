import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { CarbonUserAvatar, CilContact, CilEnvelopeClosed, StreamlineInterfaceUserEditActionsCloseEditGeometricHumanPencilPersonSingleUpUserWrite } from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import { checkUID } from "~/utils";
import gsap from "gsap";


export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    return json({
        user: cookie,
    });
};


const EditProfile = () => {

    const loader = useLoaderData();
    const user = loader.user;

    const init = async () => {

        const userdata = await ApiCall({
            query: `
        query getUserById($id:Int!){
            getUserById(id:$id){
                id,
                role,
                name,
                address,
                contact,
                email,
                user_uid
            }   
        }
        `,
            veriables: {
                id: parseInt(user.id!)
            },
        });

        if (userdata.status) {
            nameRef!.current!.value = userdata.data.getUserById.name;
            emailRef!.current!.value = userdata.data.getUserById.email;
            uidRef!.current!.value = userdata.data.getUserById.user_uid;
            addressRef!.current!.value = userdata.data.getUserById.address;
        } else {
            toast.error(userdata.message, { theme: "light" });
        }
    };

    useEffect(() => {
        init();
    }, []);


    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const uidRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);

    const submit = async () => {
        const UpdateUser = z
            .object({
                name: z
                    .string()
                    .nonempty("Applicant address is required."),
                address: z
                    .string()
                    .nonempty("Applicant address is required."),
                email: z
                    .string()
                    .email("Enter a valid email.")
                    .nonempty("Enter Email id."),
                user_uid: z
                    .string()
                    .nonempty("Enter Aadhar Number.")
                    .refine(value => checkUID(value), {
                        message: "Invalid UIDAI Number",
                    })
            })
            .strict();

        type UpdateUser = z.infer<typeof UpdateUser>;

        const userdata: UpdateUser = {
            name: nameRef!.current!.value,
            email: emailRef!.current!.value,
            user_uid: uidRef!.current!.value,
            address: addressRef!.current!.value,
        };

        const parsed = UpdateUser.safeParse(userdata);
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
                        name: userdata.name,
                        address: userdata.address,
                        email: userdata.email,
                        user_uid: userdata.user_uid,
                    }
                },
            });
            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                toast.success("User Data updated successfully", { theme: "light" });
                await init();
            }
        } else {
            toast.error(parsed.error.errors[0].message, { theme: "light" });
        }
    };


    const editbox = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(editbox.current, {
                opacity: 0,
                duration: 0.6,
                x: -50,
            });
        });
    }, []);

    return (
        <>
            <div className="p-6 rounded-md shadow-md  bg-white w-80 mt-4" ref={editbox}>
                <h1 className="text-gray-800 text-xl font-bold text-center">Update User Details</h1>
                <p className="text-left text-sm font-medium text-black mt-4">Name</p>
                <div className="bg-[#eeeeee] flex items-center rounded-md px-2 mt-1">
                    <div className="text-slate-800 font-bold text-sm mr-4">
                        <StreamlineInterfaceUserEditActionsCloseEditGeometricHumanPencilPersonSingleUpUserWrite></StreamlineInterfaceUserEditActionsCloseEditGeometricHumanPencilPersonSingleUpUserWrite>
                    </div>
                    <input
                        ref={nameRef}
                        placeholder="Enter you name"
                        className="bg-transparent outline-none border-none fill-none text-slate-800 py-1 grow"
                    />
                </div>
                <p className="text-left text-sm font-medium text-black mt-4">Email</p>
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
                <p className="text-left text-sm font-medium text-black mt-4">Aadhar Number</p>
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
                <p className="text-left text-sm font-medium text-black mt-4">Address</p>
                <div className="bg-[#eeeeee] p-2 flex items-center rounded-md mt-1">
                    <textarea
                        ref={addressRef}
                        placeholder="Address"
                        className="bg-transparent outline-none border-none fill-none text-slate-800 grow resize-none h-20"
                    ></textarea>
                </div>
                <div className="flex gap-4 items-center mt-4">
                    <button onClick={submit} className="bg-[#0984e3] rounded-md py-1 text-sm text-center text-white font-semibold flex-1 inline-block">UPDATE</button>
                </div>
            </div>
        </>
    );
}
export default EditProfile;