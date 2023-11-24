import { useRef } from "react";
import {
  MaterialSymbolsArrowForwardIosRounded,
  MaterialSymbolsSearchRounded,
} from "~/components/icons/icons";
import { toast } from "react-toastify";
import { decrypt } from "~/utils";

const Search: React.FC = (): JSX.Element => {
  const searchRef = useRef<HTMLInputElement | null>(null);

  const submit = () => {
    if (searchRef.current) {
      const search = searchRef.current.value;
      if (search) {
        const data = decrypt(search, "certificatedata");

        if (!["ZONE"].includes(data.split("-")[0])) {
          return toast.error("Invalid search keywords.", { theme: "light" });
        }

        if (data.split("-")[0] == "ZONE") {
          // window.location.href = "/zoneinfopdf/" + parseInt(data.split("-")[1]);
          window.location.href = "/zoneinfopdf/" + search;
        }
      } else {
        toast.error("Enter your search keywords.", { theme: "light" });
      }
    }
  };

  return (
    <>
      <main className="h-screen w-full bg-[#eeeeee] grid place-items-center">
        <div>
          <div className="grid place-items-center">
            <img src="./logo.png" alt="logo" className="rounded-2xl" />
            <p className="text-gray-700 text-2xl text-center mt-4">
              Single Window Portal
            </p>
            <p className="text-gray-700 text-sm text-center mb-10">
              Thrid Party Verification
            </p>
          </div>
          <div className="bg-white shadow-2xl rounded-2xl p-2 w-96 flex items-center">
            <div className="text-2xl">
              <MaterialSymbolsSearchRounded></MaterialSymbolsSearchRounded>
            </div>
            <div className="grow mx-2">
              <input
                ref={searchRef}
                type="text"
                className="border-none outline-none w-full"
                placeholder="Search..."
              />
            </div>
            <div
              className="text-3xl text-gray-600 hover:text-black cursor-pointer"
              onClick={submit}
            >
              <MaterialSymbolsArrowForwardIosRounded></MaterialSymbolsArrowForwardIosRounded>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Search;
