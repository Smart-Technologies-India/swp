import { useEffect, useRef, useState } from "react";
import {
  Fa6SolidDownload,
  Fa6SolidFileLines,
  Fa6SolidLink,
} from "~/components/icons/icons";
import { toast } from "react-toastify";
import { z } from "zod";
import { ApiCall, UploadFile } from "~/services/api";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { userPrefs } from "~/cookies";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
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
                user_uid,
                user_uid_four,
            }   
        }
        `,
    veriables: {
      id: parseInt(cookie.id!),
    },
  });
  return json({ user: userdata.data.getUserById });
};

const TempWaterConnect: React.FC = (): JSX.Element => {
  const user = useLoaderData().user;
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // const uidRef = useRef<HTMLInputElement>(null);

  const villageRef = useRef<HTMLSelectElement>(null);
  const [village, setVillage] = useState<any[]>([]);

  const MuncipalType: string[] = ["DMC", "PANCHAYAT"];
  type MuncipalType = (typeof MuncipalType)[number];
  const [muncipalType, setMuncipalType] = useState<MuncipalType>("DMC");

  const OwnerShipType: string[] = ["OWNERSHIP", "TENANT"];
  type OwnerShipType = (typeof OwnerShipType)[number];
  const [ownerShipType, setOwnerShipType] = useState<OwnerShipType>("OWNERSHIP");

  const EntityType: string[] = ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"];
  type EntityType = (typeof EntityType)[number];
  const [entityType, setEntityType] = useState<EntityType>("RESIDENTIAL");

  const ConnectionType: string[] = ["DOMESTIC", "NONDOMESTIC"];
  type ConnectionType = (typeof ConnectionType)[number];
  const [connectionType, setConnectionType] = useState<ConnectionType>("DOMESTIC");

  const fromDateRef = useRef<HTMLInputElement>(null);

  const toDateRef = useRef<HTMLInputElement>(null);

  const wardNumberRef = useRef<HTMLInputElement>(null);
  const diameterRef = useRef<HTMLInputElement>(null);
  const purposeRef = useRef<HTMLTextAreaElement>(null);
  
  // const remarkRef = useRef<HTMLInputElement>(null);

  const applicant_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [applicant_uid_url, setApplicant_uid_url] = useState<File>();

  const house_tax_url_Ref = useRef<HTMLInputElement>(null);
  const [house_tax_url, setHouse_tax_url] = useState<File>();

  const electric_bill_url_Ref = useRef<HTMLInputElement>(null);
  const [electric_bill_url, setElectric_bill_url] = useState<File>();

  const undertaking_url_Ref = useRef<HTMLInputElement>(null);
  const [undertaking_url, setUndertaking_url] = useState<File>();

  const [isChecked, setIsChecked] = useState(false);
  const sigimgRef = useRef<HTMLInputElement>(null);
  const [sigimg, setSigimg] = useState<File>();

  const navigator = useNavigate();

  const getVillage = async () => {
    const village = await ApiCall({
      query: `
        query getAllVillage{
            getAllVillage{
              id,
              name
            }
          }
      `,
      veriables: {},
    });
    if (village.status) {
      setVillage((val) => village.data.getAllVillage);
    }
  };
  useEffect(() => {
    getVillage();
    nameRef!.current!.value = user.name ?? "";
    mobileRef!.current!.value = user.contact ?? "";
    emailRef!.current!.value = user.email ?? "";
    addressRef!.current!.value = user.address ?? "";
    // uidRef!.current!.value = user.user_uid ?? "";
  }, []);

  const handleLogoChange = (
    value: React.ChangeEvent<HTMLInputElement>,
    setvalue: Function
  ) => {
    let file_size = parseInt(
      (value!.target.files![0].size / 1024 / 1024).toString()
    );
    if (file_size < 4) {
      setvalue((val: any) => value!.target.files![0]);
    } else {
      toast.error("Image file size must be less then 4 mb", { theme: "light" });
    }
  };

  const submit = async () => {
    const TempWaterConnectScheme = z
      .object({
        name: z.string().nonempty("Applicant Name is required."),
        address: z.string().nonempty("Applicant address is required."),
        mobile: z
          .string()
          .nonempty("Applicant Contact Number is required.")
          .length(10, "Mobile Number shoule be 10 digit."),
        email: z.string().email("Enter a valid email.").optional(),
        user_uid: z
          .string()
          
          .optional(),
        village_id: z.number({
          invalid_type_error: "Select a valid village",
          required_error: "Select a village",
        })
        .refine((val) => val != 0, {
          message: "Please select village",
        }),
        

        ownership_type: z.string().nonempty("Select your Ownership Type."),
        muncipal_type: z.string().nonempty("Select your Muncipal Type."),
        entity_type: z.string().nonempty("Select your Entity Type."),
        connection_type: z.string().nonempty("Select your Connection Type."),

        ward_number: z.string().nonempty("Enter Ward Number"),
        diameter: z.string().nonempty("Enter Diameter"),
        purpose: z.string().nonempty("Enter Purpose"),

        
        from_date: z.date({
          required_error: "Enter From date",
          invalid_type_error: "Enter a valid from date",
        }),
        to_date: z.date({
          required_error: "Enter To date",
          invalid_type_error: "Enter a valid To date",
        }),
       

        iagree: z.string().nonempty("I solemnly affirm & hereby."),
      })
      .strict();

    type TempWaterConnectScheme = z.infer<typeof TempWaterConnectScheme>;

    const tempWaterConnectScheme: TempWaterConnectScheme = {
      name: nameRef!.current!.value,
      address: addressRef!.current!.value,
      mobile: mobileRef!.current!.value,
      email: emailRef!.current!.value,
      user_uid: user.user_uid_four,
      village_id: parseInt(villageRef!.current!.value),
      from_date: new Date(fromDateRef!.current!.value),
      to_date: new Date(toDateRef!.current!.value),
      ward_number: wardNumberRef!.current!.value,
      diameter: diameterRef!.current!.value,
      purpose: purposeRef!.current!.value,
      

      iagree: isChecked ? "YES" : "NO",
      connection_type: connectionType,
      entity_type: entityType,
      muncipal_type: muncipalType,
      ownership_type: ownerShipType,
      
    };

    const parsed = TempWaterConnectScheme.safeParse(tempWaterConnectScheme);

    if (parsed.success) {
      if (sigimg == null || sigimg == undefined) {
        toast.error("Select Signature Image.", { theme: "light" });
      }
      const sign_url = await UploadFile(sigimg!);

      if (house_tax_url == null || house_tax_url == undefined) {
        toast.error("Upload House Tax Copy.", { theme: "light" });
      }
      const house_tax_urlt = await UploadFile(sigimg!);

      if (electric_bill_url == null || electric_bill_url == undefined) {
        toast.error("Upload Electric Bill Copy.", { theme: "light" });
      }
      const electric_bill_urlt = await UploadFile(sigimg!);

      if (applicant_uid_url == null || applicant_uid_url == undefined) {
        toast.error("Upload Applicant UID.", { theme: "light" });
      }
      const applicant_uid_urlt = await UploadFile(sigimg!);

      if (undertaking_url == null || undertaking_url == undefined) {
        toast.error("Upload Undertaking.", { theme: "light" });
      }
      const undertaking_urlt = await UploadFile(sigimg!);

      if (
        electric_bill_urlt.status &&
        sign_url.status &&
        house_tax_urlt.status &&
        applicant_uid_urlt.status &&
        undertaking_urlt.status
      ) {
        const data = await ApiCall({
          query: `
              mutation createTempWaterConnect($createTempWaterConnectInput:CreateTempWaterConnectInput!){
                createTempWaterConnect(createTempWaterConnectInput:$createTempWaterConnectInput){
                    id
                  }
                }
              `,
          veriables: {
            createTempWaterConnectInput: {
              userId: Number(user.id),
              name: tempWaterConnectScheme.name,
              address: tempWaterConnectScheme.address,
              email: tempWaterConnectScheme.email,
              mobile: tempWaterConnectScheme.mobile,
              user_uid: tempWaterConnectScheme.user_uid,
              village_id: tempWaterConnectScheme.village_id,
              ward_number: tempWaterConnectScheme.ward_number,
              diameter: tempWaterConnectScheme.diameter,
              purpose: tempWaterConnectScheme.purpose,
              house_tax_url: house_tax_urlt.data,
              electric_bill_url: electric_bill_urlt.data,
              applicant_uid_url: applicant_uid_urlt.data,
              undertaking_url: undertaking_urlt.data,
              signature_url: sign_url.data,
              iagree: tempWaterConnectScheme.iagree,
              status: "ACTIVE",
              from_date: tempWaterConnectScheme.from_date,
              to_date: tempWaterConnectScheme.to_date,
              connection_type: tempWaterConnectScheme.connection_type,
              entity_type: tempWaterConnectScheme.entity_type,
              muncipal_type: tempWaterConnectScheme.muncipal_type,
              ownership_type: tempWaterConnectScheme.ownership_type,

            },
          },
        });
        if (!data.status) {
          toast.error(data.message, { theme: "light" });
        } else {
          navigator(
            `/home/pwd/tempwaterconnectview/${data.data.createTempWaterConnect.id}`
          );
        }
      } else {
        toast.error("Something went wrong unable to upload images.", {
          theme: "light",
        });
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };

  useEffect(() => {
    nameRef!.current!.value = user.name ?? "";
    mobileRef!.current!.value = user.contact ?? "";
    emailRef!.current!.value = user.email ?? "";
    addressRef!.current!.value = user.address ?? "";
    // uidRef!.current!.value = user.user_uid ?? "";
  }, []);

  const handleNumberChange = () => {
    if (mobileRef.current) {
      const numericValue = mobileRef.current.value.replace(/[^0-9]/g, "");
      if (numericValue.toString().length <= 10) {
        mobileRef.current.value = numericValue;
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
        <h1 className="text-gray-800 text-2xl font-semibold text-center">
          Temporary Water Connection Application
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          Format of Application for obtaining Temporary Water Connection.{" "}
        </p>

        {/*--------------------- section 1 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            1. Village Details{" "}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">1.1</span> Applicant village
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <select
              ref={villageRef}
              defaultValue={"0"}
              className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2"
            >
              <option
                value="0"
                className="bg-white text-blakc text-lg"
                disabled
              >
                Select village
              </option>
              {village.map((val: any, index: number) => (
                <option
                  key={index}
                  value={val.id}
                  className="bg-white text-black text-lg"
                >
                  {val.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/*--------------------- section 1 end here ------------------------- */}

        {/*--------------------- section 2 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            2. Applicant Details(s){" "}
          </p>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.1</span> Applicant Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={nameRef}
              placeholder="Applicant Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.2</span> Applicant Address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={addressRef}
              placeholder="Applicant address"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
            ></textarea>
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.3</span> Applicant Contact Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={mobileRef}
              placeholder="Applicant Contact Number"
              maxLength={10}
              onChange={handleNumberChange}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.4</span> Applicant Email
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={emailRef}
              placeholder="Applicant Email"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.5</span> Applicant UID
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
          <div className="w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2">
              {" "}
              XXXX-XXXX-{user.user_uid_four.toString()}
            </div>
          </div>
        </div>


        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.6</span> House Ownership Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {OwnerShipType.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setOwnerShipType(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == ownerShipType}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.7</span> House Ward Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={wardNumberRef}
              placeholder="Applicant Ward Number "
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        {/*--------------------- section 2 end here ------------------------- */}

        {/*--------------------- section 3 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            3. Coonection Detail(s){" "}
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.1</span> House Muncipal Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {MuncipalType.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setMuncipalType(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == muncipalType}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.2</span> Diameter Required
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={diameterRef}
              placeholder="Diameter Required"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.3</span> Entity Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {EntityType.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setEntityType(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == entityType}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.4</span> Connection Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {ConnectionType.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setConnectionType(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == connectionType}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.5</span> Purpose
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={purposeRef}
              placeholder="Purpose"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            ></textarea>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.6</span> Connection Start Date
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={fromDateRef}
              min={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.7</span> Connection End Date
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={toDateRef}
              min={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
       
        {/*--------------------- section 3 end here ------------------------- */}

        {/*--------------------- section 4 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            4. Attachment(s){" "}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.1</span> Applicant UIDAI Aadhaar Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={applicant_uid_url_Ref}
                onChange={(e) => handleLogoChange(e, setApplicant_uid_url)}
              />
            </div>
            <button
              onClick={() => applicant_uid_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {applicant_uid_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {applicant_uid_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(applicant_uid_url)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.2</span> House Tax Copy Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={house_tax_url_Ref}
                onChange={(e) => handleLogoChange(e, setHouse_tax_url)}
              />
            </div>
            <button
              onClick={() => house_tax_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {house_tax_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {house_tax_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(house_tax_url)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.3</span> Electricity Bill Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={electric_bill_url_Ref}
                onChange={(e) => handleLogoChange(e, setElectric_bill_url)}
              />
            </div>
            <button
              onClick={() => electric_bill_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {electric_bill_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {electric_bill_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(electric_bill_url)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">3.4</span> Undertaking
            <a
              href="/undertaking_pwd.pdf"
              download
              className="text-blue-500 flex gap-2 items-center"
            >
              {" "}
              <Fa6SolidDownload className="text-lg" />{" "}
              <p> Click to Download Format</p>
            </a>
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={undertaking_url_Ref}
                onChange={(e) => handleLogoChange(e, setUndertaking_url)}
              />
            </div>
            <button
              onClick={() => undertaking_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {undertaking_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {undertaking_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(undertaking_url)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        {/*--------------------- section 4 end here ------------------------- */}

        {/*--------------------- section 5 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            5. Applicant / Occupant Declaration and Signature{" "}
          </p>
        </div>

        <div className="flex gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="text-xl font-normal text-left text-gray-700 ">
            5.1
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mr-2 my-2"
            />
            <label
              htmlFor="checkbox"
              className="text-xl font-normal text-left text-gray-700 "
            >
              I solemnly affirm & hereby give undertaking that the above
              information furnished by me are correct and true to the best of my
              knowledge and belief
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">5.2</span> Applicant Signature Image Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 4MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={sigimgRef}
                accept="*/*"
                onChange={(e) => handleLogoChange(e, setSigimg)}
              />
            </div>
            <button
              onClick={() => sigimgRef.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {sigimg == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {sigimg != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(sigimg)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        {/*--------------------- section 5 end here ------------------------- */}
        <div className="flex flex-wrap gap-6 mt-4">
          <Link
            to={"/home/"}
            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
          >
            Discard & Close
          </Link>
          <button
            onClick={submit}
            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
          >
            Preview & Proceed
          </button>
        </div>
      </div>
    </>
  );
};

export default TempWaterConnect;
