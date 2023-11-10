import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const id = props.params.id;

    const url = new URL(props.request.url);
    const password = url.searchParams.get("password");
    const access_key = url.searchParams.get("access_key");


    if (password == undefined || password == null || password == "") {
        return json({ status: false, message: "Please enter the password" });
    } else if (access_key == undefined || access_key == null || access_key == "") {
        return json({ status: false, message: "Please enter Access key " });
    } else if (password == "23q4lHe6Fh") {
        const userupdate = await ApiCall({
            query: `
            mutation updateUserDPById($updateUserInput:UpdateUserInput!){
            updateUserDPById(updateUserInput:$updateUserInput)
          }
      `,
            veriables: {
                updateUserInput: {
                    id: parseInt(id!),
                    access_kay: access_key
                }
            },
        });
        if (!userupdate.status) {
            return json({ status: false, message: "Unable to store access key." });
        }
        const userdata = await ApiCall({
            query: `
        query loginwithid($id:Int!){
            loginwithid(id:$id){
              id,
              role,
              contact,
              token,
              name
            }
          }
      `,
            veriables: {
                id: parseInt(id!)
            },
        });

        if (userdata.status) {
            return redirect("/home", {
                headers: {
                    "Set-Cookie": await userPrefs.serialize(userdata.data.loginwithid),
                },
            });
        } else {
            return json({ status: userdata.status, message: userdata.message });
        }
    } else {
        return json({ status: false, message: "API Password is Wrong" });
    }
}
const OutLogin = (): JSX.Element => {
    const message = useLoaderData().message;
    return (
        <>
            <div className="min-h-screen grid place-items-center w-full">
                <div className="rounded-md  bg-rose-500 bg-opacity-20 p-6">
                    <h2 className="text-rose-500 text-center text-3xl">{message}</h2>
                    <div className="grid place-items-center mt-4">
                        <Link to="/" className="text-white text-xl font-semibold py-2 px-4 rounded-md bg-rose-500">GO BACK TO HOME</Link>
                    </div>
                </div>
            </div>
        </>

    );
}

export default OutLogin;