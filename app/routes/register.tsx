import { Form, Link, useNavigate } from "@remix-run/react";
import { number, z } from "zod";

import { toast } from "react-toastify";
import { useRef, useState } from "react";
import { ApiCall } from "~/services/api";
import { Fa6SolidEye, Fa6SolidEyeSlash, Fa6SolidUser } from "~/components/icons/icons";
import { ActionArgs, LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
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


export default function register() {

    const navitgator = useNavigate();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showRePassword, setShowRePassword] = useState<boolean>(false);

    const nextButton = useRef<HTMLButtonElement>(null);


    const nameRef = useRef<HTMLInputElement>(null);
    const numbeRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const rePassRef = useRef<HTMLInputElement>(null);

    const iref = useRef<HTMLInputElement>(null);
    const cref = useRef<HTMLInputElement>(null);
    const nref = useRef<HTMLInputElement>(null);
    const rref = useRef<HTMLInputElement>(null);
    const tref = useRef<HTMLInputElement>(null);

    const handelPassword = () => {
        setShowPassword((val) => !val);
    };
    const handelRePassword = () => {
        setShowRePassword((val) => !val);
    };

    const submit = async () => {
        const RegisterScheme = z
            .object({
                name: z
                    .string()
                    .nonempty("Name is required"),
                contact: z
                    .string()
                    .nonempty("Contact number is required"),
                password: z
                    .string()
                    .nonempty("Password is required")
                    .min(8, "Password should be have atlest 8 character.")
                    .regex(
                        /[A-Z]/,
                        "Password should be contain atleast one Capital letter."
                    )
                    .regex(
                        /[a-z]/,
                        "Password should be contain atleast one lower letter."
                    )
                    .regex(/\d/, "Password should be contain atleast one degit letter.")
                    .regex(
                        /[@$!%*?&]/,
                        "Password should be contain atleast one specil character [@$!%*?&]."
                    ),
                repassword: z
                    .string()
                    .nonempty("Re-Password is required")
                    .min(8, "Re-Password should be have atlest 8 character.")
                    .regex(
                        /[A-Z]/,
                        "Re-Password should be contain atleast one Capital letter."
                    )
                    .regex(
                        /[a-z]/,
                        "Re-Password should be contain atleast one lower letter."
                    )
                    .regex(
                        /\d/,
                        "Re-Password should be contain atleast one degit letter."
                    )
                    .regex(
                        /[@$!%*?&]/,
                        "Re-Password should be contain atleast one specil character [@$!%*?&]."
                    ),
            })
            .strict()
            .refine(
                (val) => {
                    if (val.password == val.repassword) {
                        return true;
                    }
                },
                { message: "Password and Re-Password should be the same" }
            );


        type RegisterScheme = z.infer<typeof RegisterScheme>;

        const register: RegisterScheme = {
            contact: numbeRef!.current!.value,
            name: nameRef!.current!.value,
            password: passRef!.current!.value,
            repassword: rePassRef!.current!.value,
        };


        const parsed = RegisterScheme.safeParse(register);
        if (parsed.success) {

            const data = await ApiCall({
                query: `
                    mutation signup($signUpUser:SignUpUserInput!){
                        signup(signUpUserInput:$signUpUser){
                            id,
                            token,
                            name,
                            contact,
                            role
                        }
                    }
                `,
                veriables: {
                    signUpUser: { contact: register.contact, name: register.name, password: register.password },
                },
            });


            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                iref!.current!.value = data.data.signup!.id;
                nref!.current!.value = data.data.signup!.name;
                cref!.current!.value = data.data.signup!.contact;
                rref!.current!.value = data.data.signup!.role;
                tref!.current!.value = data.data.signup!.token;
                nextButton.current!.click();
            }
        } else {
            toast.error(parsed.error.errors[0].message, { theme: "light" });
        }
    };
    return (
        <div>
            <div className="min-h-screen w-full bg-[#eeeeee] grid place-items-center">
                <div className="p-6 rounded-md shadow-md hover:shadow-xl hover:scale-105 transition-all bg-white border-t-4 border-purple-500">
                    <h1 className="text-gray-800 text-xl font-bold">PLANNING & DEVELOPMENT AUTHORITY</h1>
                    <p className="text-lg my-4 text-gray-700 text-center">Sign up to start you session</p>
                    <div className="border-b-2 border-gray-200 py-1 flex items-center">
                        <div
                            className="text-slate-800 font-bold text-xl mr-4"
                        >
                            <Fa6SolidUser></Fa6SolidUser>
                        </div>
                        <input
                            ref={nameRef}
                            type="text"
                            placeholder="User Name"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 py-2"
                        />
                    </div>
                    <div className="border-b-2 border-gray-200 py-1 flex items-center mt-4">
                        <div
                            className="text-slate-800 font-bold text-xl mr-4"
                        >
                            <Fa6SolidUser></Fa6SolidUser>
                        </div>
                        <input
                            ref={numbeRef}
                            type="text"
                            placeholder="Contact Number"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 py-2"
                        />
                    </div>
                    <div className="border-b-2 border-gray-200 py-1 mt-4 flex items-center">
                        <div
                            className="text-slate-800 font-bold text-xl mr-4"
                            onClick={handelPassword}
                        >
                            {showPassword ? <Fa6SolidEye></Fa6SolidEye> : <Fa6SolidEyeSlash></Fa6SolidEyeSlash>}
                        </div>
                        <input
                            ref={passRef}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 py-2"
                        />
                    </div>
                    <div className="border-b-2 border-gray-200 py-1 mt-4 flex items-center">
                        <div
                            className="text-slate-800 font-bold text-xl mr-4"
                            onClick={handelRePassword}
                        >
                            {showRePassword ? <Fa6SolidEye></Fa6SolidEye> : <Fa6SolidEyeSlash></Fa6SolidEyeSlash>}
                        </div>
                        <input
                            ref={rePassRef}
                            type={showRePassword ? "text" : "password"}
                            placeholder="Re-Password"
                            className="bg-transparent outline-none border-none fill-none text-slate-800 py-2"
                        />
                    </div>
                    <button
                        onClick={submit}
                        className="inline-block text-center text-white bg-purple-500 py-2 px-6 text-xl font-medium rounded-md w-full mt-6"
                    >
                        Register
                    </button>
                    <h5 className="text-slate-800 text-center mt-6">
                        Already have an account?{" "}
                        <Link to={"/login"} className="text-blue-500">
                            Sign In
                        </Link>
                    </h5>
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
        </div>
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
