import { redirect, type ActionArgs, type V2_MetaFunction, LoaderFunction, LoaderArgs } from "@remix-run/node";
import { Fa6SolidEye, Fa6SolidEyeSlash, Fa6SolidUser } from "~/components/icons/icons";
import { z } from "zod";

import { toast } from "react-toastify";
import { Form, Link, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { ApiCall } from "~/services/api";
import { userPrefs } from "~/cookies";


export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    if (
        !(cookie == null ||
            cookie == undefined ||
            Object.keys(cookie).length == 0)
    ) {
        return redirect("/home");
    }

    return null;
};



export default function Index() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const nextButton = useRef<HTMLButtonElement>(null);

    const iref = useRef<HTMLInputElement>(null);
    const cref = useRef<HTMLInputElement>(null);
    const nref = useRef<HTMLInputElement>(null);
    const rref = useRef<HTMLInputElement>(null);
    const tref = useRef<HTMLInputElement>(null);


    const numberRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const submit = async () => {
        const LoginScheme = z
            .object({
                contact: z
                    .string()
                    .nonempty("Contact Number is required"),
                password: z
                    .string()
                    .nonempty("Password is required")
                    .min(8, "Password should be have atlest 8 character."),
            })
            .strict();

        type LoginScheme = z.infer<typeof LoginScheme>;

        const login: LoginScheme = {
            contact: numberRef!.current!.value,
            password: passRef!.current!.value,
        };

        const parsed = LoginScheme.safeParse(login);
        if (parsed.success) {
            const data = await ApiCall({
                query: `
        query singin($loginUserInput:LoginUserInput!){
          signin(loginUserInput:$loginUserInput){
            id,
            token,
            name,
            contact,
            role
          }
        }
      `,
                veriables: { loginUserInput: login },
            });
            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                iref!.current!.value = data.data.signin!.id;
                nref!.current!.value = data.data.signin!.name;
                cref!.current!.value = data.data.signin!.contact;
                rref!.current!.value = data.data.signin!.role;
                tref!.current!.value = data.data.signin!.token;
                nextButton.current!.click();
            }
        } else {
            toast.error(parsed.error.errors[0].message, { theme: "light" });
        }
    };

    return (
        <>
            <div className="min-h-screen w-full bg-[#eeeeee] grid place-items-center">
                <div className="p-6 rounded-md shadow-md hover:shadow-xl hover:scale-105 transition-all bg-white border-t-4 border-purple-500">
                    <h1 className="text-gray-800 text-xl font-bold">PLANNING & DEVELOPMENT AUTHORITY</h1>
                    <p className="text-lg my-4 text-gray-700 text-center">Sign in to start you session</p>

                    <div className="border-b-2 border-gray-200 py-1 flex items-center">
                        <div className="text-slate-800 font-bold text-xl mr-4">
                            <Fa6SolidUser></Fa6SolidUser>
                        </div>
                        <input
                            type="text"
                            ref={numberRef}
                            placeholder="Mobile Number"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 py-2 grow"
                        />
                    </div>
                    <div className="border-b-2 border-gray-200 py-1 mt-4 flex items-center">
                        <div className="text-slate-800 font-bold text-xl mr-4" onClick={() => setShowPassword(val => !showPassword)}>
                            {showPassword ? <Fa6SolidEye></Fa6SolidEye> : <Fa6SolidEyeSlash></Fa6SolidEyeSlash>}
                        </div>
                        <input
                            ref={passRef}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 py-2 grow"
                        />
                    </div>
                    <button onClick={submit}
                        className="inline-block text-center text-white bg-purple-500 py-2 px-6 text-xl font-medium rounded-md w-full mt-6"
                    >
                        Login
                    </button>
                    <p className="text-md font-semibold text-gray-800 mt-6 text-center">Don't have an account? <Link to="/register" className="text-blue-500 cursor-pointer">Click here</Link></p>
                </div>
            </div>
            <div className="hidden">
                <Form method="post">
                    <input type="hidden" name="id" ref={iref} />
                    <input type="hidden" name="token" ref={tref} />
                    <input type="hidden" name="contact" ref={cref} />
                    <input type="hidden" name="name" ref={nref} />
                    <input type="hidden" name="role" ref={rref} />
                    <button ref={nextButton} name="submit">
                        Submit
                    </button>
                </Form>
            </div>
        </>
    );
}

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();
    const value = Object.fromEntries(formData);

    return redirect("/home", {
        headers: {
            "Set-Cookie": await userPrefs.serialize(value),
        },
    });
}

