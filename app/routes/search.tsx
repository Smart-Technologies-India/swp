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

        if (
          ![
            "ZONE",
            "NEWWATERCONNECT",
            "TEMPWATERCONNECT",
            "TEMPWATERDISCONNECT",
            "WATERSIZECHANGE",
            "WATERRECONNECT",
            "PERMANENTWATERDISCONNECT",
          ].includes(data.split("-")[0])
        ) {
          return toast.error("Invalid search keywords.", { theme: "light" });
        }

        if (data.split("-")[0] == "ZONE") {
          window.location.href = "/zoneinfopdf/" + search;
        } else if (data.split("-")[0] == "NWC") {
          window.location.href = "/newwaterconnectpdf/" + search;
        } else if (data.split("-")[0] == "TWC") {
          window.location.href = "/tempwaterconnectpdf/" + search;
        } else if (data.split("-")[0] == "TWD") {
          window.location.href = "/tempwaterdisconnectpdf/" + search;
        } else if (data.split("-")[0] == "WSC") {
          window.location.href = "/watersizechangepdf/" + search;
        } else if (data.split("-")[0] == "WR") {
          window.location.href = "/waterreconnectpdf/" + search;
        } else if (data.split("-")[0] == "PWD") {
          window.location.href = "/permanentwaterdisconnectpdf/" + search;
        } else if (data.split("-")[0] == "MAR") {
          window.location.href = "/marriagepdf/" + search;
        } else if (data.split("-")[0] == "REG") {
          window.location.href = "/religiouspdf/" + search;
        } else if (data.split("-")[0] == "RS") {
          window.location.href = "/roadshowpdf/" + search;
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
