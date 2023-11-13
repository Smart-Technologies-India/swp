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
import { checkUID } from "~/utils";

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
                user_uid
            }   
        }
        `,
    veriables: {
      id: parseInt(cookie.id!),
    },
  });
  return json({ user: userdata.data.getUserById });
};

const DeathCertificate: React.FC = (): JSX.Element => {
  const user = useLoaderData().user;
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const uidRef = useRef<HTMLInputElement>(null);

  const villageRef = useRef<HTMLSelectElement>(null);
  const [village, setVillage] = useState<any[]>([]);

  const Gender: string[] = ["MALE", "FEMALE", "OTHER"];
  type Gender = (typeof Gender)[number];
  const [gender, setGender] = useState<Gender>("MALE");

  const dateOfBirthRef = useRef<HTMLInputElement>(null);

  const dateOfDeathRef = useRef<HTMLInputElement>(null);

  const fatherNameRef = useRef<HTMLInputElement>(null);
  const motherNameRef = useRef<HTMLInputElement>(null);
  const husbandNameRef = useRef<HTMLInputElement>(null);
  const placeOfDeathRef = useRef<HTMLInputElement>(null);

  const registrationNumberRef = useRef<HTMLInputElement>(null);

  const registrationDateRef = useRef<HTMLInputElement>(null);

  const remarkRef = useRef<HTMLInputElement>(null);

  const applicant_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [applicant_uid_url, setApplicant_uid_url] = useState<File>();

  const father_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [father_uid_url, setFather_uid_url] = useState<File>();

  const mother_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [mother_uid_url, setMother_uid_url] = useState<File>();

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
    uidRef!.current!.value = user.user_uid ?? "";
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
    const DeathCertificateScheme = z
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
          .refine((value) => checkUID(value), {
            message: "Invalid UIDAI Number",
          })
          .optional(),
        village_id: z.number({
          invalid_type_error: "Select a valid village",
          required_error: "Select a village",
        })
        .refine((val) => val != 0, {
          message: "Please select village",
        }),
        gender: z.string().nonempty("Select your gender."),

        father_name: z.string().nonempty("Enter Father Name"),
        mother_name: z.string().nonempty("Enter Mother Name"),
        husband_name: z.string().nonempty("Enter Husband Name"),

        registration_number: z.string().nonempty("Enter Registration Number"),
        date_of_death: z.date({
          required_error: "Enter death date",
          invalid_type_error: "Enter a valid death date",
        }),
        date_of_birth: z.date({
          required_error: "Enter birth date",
          invalid_type_error: "Enter a valid birth date",
        }),
        place_of_death: z.string().nonempty("Enter Place of Death"),
        date_of_registration: z.date({
          required_error: "Enter Registration date",
          invalid_type_error: "Enter a valid Registration date",
        }),

        iagree: z.string().nonempty("I solemnly affirm & hereby."),
      })
      .strict();

    type DeathCertificateScheme = z.infer<typeof DeathCertificateScheme>;

    const deathCertificateScheme: DeathCertificateScheme = {
      name: nameRef!.current!.value,
      address: addressRef!.current!.value,
      mobile: mobileRef!.current!.value,
      email: emailRef!.current!.value,
      user_uid: uidRef!.current!.value,
      village_id: parseInt(villageRef!.current!.value),
      date_of_death: new Date(dateOfDeathRef!.current!.value),
      date_of_birth: new Date(dateOfBirthRef!.current!.value),
      date_of_registration: new Date(registrationDateRef!.current!.value),
      father_name: fatherNameRef!.current!.value,
      mother_name: motherNameRef!.current!.value,
      husband_name: husbandNameRef!.current!.value,
      place_of_death: placeOfDeathRef!.current!.value,
      registration_number: registrationNumberRef!.current!.value,

      iagree: isChecked ? "YES" : "NO",
      gender: gender,
    };


    const parsed = DeathCertificateScheme.safeParse(deathCertificateScheme);

    if (parsed.success) {
      if (sigimg == null || sigimg == undefined) {
        toast.error("Select Signature Image.", { theme: "light" });
      }
      const sign_url = await UploadFile(sigimg!);

      if (father_uid_url == null || father_uid_url == undefined) {
        toast.error("Upload Father UID.", { theme: "light" });
      }
      const father_uid_urlt = await UploadFile(sigimg!);

      if (mother_uid_url == null || mother_uid_url == undefined) {
        toast.error("Upload Mother UID.", { theme: "light" });
      }
      const mother_uid_urlt = await UploadFile(sigimg!);

      if (applicant_uid_url == null || applicant_uid_url == undefined) {
        toast.error("Upload Applicant UID.", { theme: "light" });
      }
      const applicant_uid_urlt = await UploadFile(sigimg!);

      if (undertaking_url == null || undertaking_url == undefined) {
        toast.error("Upload Undertaking.", { theme: "light" });
      }
      const undertaking_urlt = await UploadFile(sigimg!);

      if (
        father_uid_urlt.status &&
        sign_url.status &&
        mother_uid_url &&
        applicant_uid_urlt.status &&
        undertaking_urlt.status
      ) {
        const data = await ApiCall({
          query: `
              mutation createDeathCertificate($createDeathCertificateInput:CreateDeathCertificateInput!){
                createDeathCertificate(createDeathCertificateInput:$createDeathCertificateInput){
                    id
                  }
                }
              `,
          veriables: {
            createDeathCertificateInput: {
              userId: Number(user.id),
              name: deathCertificateScheme.name,
              address: deathCertificateScheme.address,
              email: deathCertificateScheme.email,
              mobile: deathCertificateScheme.mobile,
              user_uid: deathCertificateScheme.user_uid,
              village_id: deathCertificateScheme.village_id,
              father_name: deathCertificateScheme.father_name,
              mother_name: deathCertificateScheme.mother_name,
              husband_name: deathCertificateScheme.husband_name,
              place_of_death: deathCertificateScheme.place_of_death,
              registration_number: deathCertificateScheme.registration_number,
              father_uid_url: father_uid_urlt.data,
              mother_uid_url: mother_uid_urlt.data,
              applicant_uid_url: applicant_uid_urlt.data,
              undertaking_url: undertaking_urlt.data,
              signature_url: sign_url.data,
              iagree: deathCertificateScheme.iagree,
              status: "ACTIVE",
              date_of_death: deathCertificateScheme.date_of_death,
              date_of_birth: deathCertificateScheme.date_of_birth,
              date_of_registration: deathCertificateScheme.date_of_registration,
              gender: deathCertificateScheme.gender,
            },
          },
        });
        if (!data.status) {
          toast.error(data.message, { theme: "light" });
        } else {
          navigator(
            `/home/crsr/deathcertview/${data.data.createDeathCertificate.id}`
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
    uidRef!.current!.value = user.user_uid ?? "";
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
        <h1 className="text-gray-800 text-3xl font-semibold text-center">
          Death Certificate Re-Issue Application
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          Format of Application for obtaining old Death certificate.{" "}
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
            <span className="mr-2">2.2</span> Applicant address
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
            <input
              ref={uidRef}
              placeholder="Applicant UID"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.6</span> Applicant Gender
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {Gender.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setGender(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == gender}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.7</span> Applicant Date of Birth
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={dateOfBirthRef}
              min={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.8</span> Applicant Date of Death
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={dateOfDeathRef}
              min={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.9</span> Applicant Place of Death
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={placeOfDeathRef}
              placeholder="Applicant Place of Death"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.10</span> Applicant Father Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={fatherNameRef}
              placeholder="Applicant Father Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.11</span> Applicant Mother Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={motherNameRef}
              placeholder="Applicant Mother Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.12</span> Applicant Husband/Wife Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={husbandNameRef}
              placeholder="Applicant Husband/Wife Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.13</span> Registration Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={registrationNumberRef}
              placeholder="Registration Number"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.14</span>Date of Registration
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={registrationDateRef}
              min={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        {/*--------------------- section 2 end here ------------------------- */}

        {/*--------------------- section 3 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            3. Attachment(s){" "}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">3.1</span> Applicant UIDAI Aadhaar Upload
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
            <span className="mr-2">3.2</span> Applicant Father UIDAI Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={father_uid_url_Ref}
                onChange={(e) => handleLogoChange(e, setFather_uid_url)}
              />
            </div>
            <button
              onClick={() => father_uid_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {father_uid_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {father_uid_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(father_uid_url)}
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
            <span className="mr-2">3.3</span> Applicant Mother UIDAI Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={mother_uid_url_Ref}
                onChange={(e) => handleLogoChange(e, setMother_uid_url)}
              />
            </div>
            <button
              onClick={() => mother_uid_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {mother_uid_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {mother_uid_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(mother_uid_url)}
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
              href="/undertaking_establish.pdf"
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

        {/*--------------------- section 3 end here ------------------------- */}

        {/*--------------------- section 4 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            4. Applicant / Occupant Declaration and Signature{" "}
          </p>
        </div>

        <div className="flex gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="text-xl font-normal text-left text-gray-700 ">
            4.1
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
            <span className="mr-2">4.2</span> Applicant Signature Image
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

        {/*--------------------- section 4 end here ------------------------- */}
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

export default DeathCertificate;
