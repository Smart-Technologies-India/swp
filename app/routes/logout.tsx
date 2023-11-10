import { LoaderArgs, redirect } from "@remix-run/node";
import { userPrefs } from "~/cookies";

export async function loader({ request }: LoaderArgs) {
    return redirect("/", {
        headers: {
            "Set-Cookie": await userPrefs.serialize({}),
        },
    });
}

const Logout = () => {
    return (
        <>
            <h1>This is logout page</h1>
        </>
    );
};
export default Logout;
