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
//1
const DeathRegister: React.FC = (): JSX.Element => {
  const user = useLoaderData().user;
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // const uidRef = useRef<HTMLInputElement>(null);

  const villageRef = useRef<HTMLSelectElement>(null);
  const [village, setVillage] = useState<any[]>([]);

  const Gender: string[] = ["MALE", "FEMALE", "OTHER"];
  type Gender = (typeof Gender)[number];
  const [gender, setGender] = useState<Gender>("MALE");

  const BirthPlace: string[] = ["HOME", "HOSPITAL", "OTHER"];
  type BirthPlace = (typeof BirthPlace)[number];
  const [deathPlace, setDeathPlace] = useState<BirthPlace>("HOSPITAL");

  const AttendentType: string[] = [
    "DOCTOR",
    "NURSE",
    "DOMESTICEXPERT",
    "OTHER",
  ];
  type AttendentType = (typeof AttendentType)[number];
  const [attendentType, setAttendentType] = useState<AttendentType>("DOCTOR");

  const [pregnancyDeath, setPregnancyDeath] = useState<boolean>(false);
  const [deathCertified, setDeathCertified] = useState<boolean>(false);
  const [smokerDeath, setSmokerDeath] = useState<boolean>(false);
  const [alcoholicDeath, setAlcoholicDeath] = useState<boolean>(false);

  const Religion: string[] = ["HINDU", "MUSLIM", "CHRISTIAN", "OTHER"];
  type Religion = (typeof Religion)[number];
  const [religion, setReligion] = useState<Religion>("HINDU");

  const dateOfDeathRef = useRef<HTMLInputElement>(null);

  const nameOfDeceasedRef = useRef<HTMLInputElement>(null);
  const deceasedUidRef = useRef<HTMLInputElement>(null);
  const fatherNameRef = useRef<HTMLInputElement>(null);
  const motherNameRef = useRef<HTMLInputElement>(null);
  const wifeNameRef = useRef<HTMLInputElement>(null);
  const deathPlaceNameRef = useRef<HTMLInputElement>(null);
  const diseaseNameRef = useRef<HTMLInputElement>(null);

  const currentAddressRef = useRef<HTMLTextAreaElement>(null);
  const permanentAddressRef = useRef<HTMLTextAreaElement>(null);
  const deathPlaceAddressRef = useRef<HTMLTextAreaElement>(null);

  const deceasedOccupationRef = useRef<HTMLInputElement>(null);

  const dateOfBirthRef = useRef<HTMLInputElement>(null);

  // const remarkRef = useRef<HTMLInputElement>(null);

  const father_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [father_uid_url, setFather_uid_url] = useState<File>();

  const deceased_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [deceased_uid_url, setDeceased_uid_url] = useState<File>();

  const authority_letter_url_Ref = useRef<HTMLInputElement>(null);
  const [authority_letter_url, setAuthority_letter_url] = useState<File>();

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
  //2
  const submit = async () => {
    const DeathRegisterScheme = z
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
        village_id: z
          .number({
            invalid_type_error: "Select a valid village",
            required_error: "Select a village",
          })
          .refine((val) => val != 0, {
            message: "Please select village",
          }),

        gender: z.string().nonempty("Select Gender of Child."),
        religion_deceased: z.string().nonempty("Select religion of Deceased"),
        attender_type: z.string().nonempty("Select Attender TYpe"),
        death_place: z.string().nonempty("Select Death Place"),

        name_of_deceased: z.string().nonempty("Enter Name of Deceased"),
        deceased_uid: z.string().nonempty("Enter Aadhar Details of Deceased"),
        father_name: z.string().nonempty("Enter Father Name"),
        mother_name: z.string().nonempty("Enter Mother Name"),
        wife_name: z.string().nonempty("Enter Wife / Husband Name"),
        death_place_name: z.string().nonempty("Enter Death Place Name"),
        current_address: z.string().nonempty("Enter Current Address"),
        permanent_address: z.string().nonempty("Enter Permanent Address"),
        death_place_address: z.string().nonempty("Enter Death Place Address"),
        deceased_occupation: z.string().nonempty("Enter Deceased Occupation"),
        name_of_disease: z.string().nonempty("Enter Name of Disease"),
        pregnancy_death: z.boolean({
          required_error: "Pregnancy death is required.",
        }),
        smoker_death: z.boolean({
          required_error: "Smoker death is required.",
        }),
        alcoholic_death: z.boolean({
          required_error: "Alcoholic death is required.",
        }),
        death_certified: z.boolean({
          required_error: "Certified death is required.",
        }),

        date_of_birth: z.date({
          required_error: "Enter Date of Birth",
          invalid_type_error: "Enter a valid Date of Birth",
        }),
        date_of_death: z.date({
          required_error: "Enter Date of Death",
          invalid_type_error: "Enter Date of Death",
        }),

        iagree: z.string().nonempty("I solemnly affirm & hereby."),
      })
      .strict();

    type DeathRegisterScheme = z.infer<typeof DeathRegisterScheme>;
    const deathRegisterScheme: DeathRegisterScheme = {
      name: nameRef!.current!.value,
      address: addressRef!.current!.value,
      mobile: mobileRef!.current!.value,
      email: emailRef!.current!.value,
      user_uid: user.user_uid_four,
      village_id: parseInt(villageRef!.current!.value),

      date_of_birth: new Date(dateOfBirthRef!.current!.value),
      date_of_death: new Date(dateOfDeathRef!.current!.value),
      name_of_deceased: nameOfDeceasedRef!.current!.value,
      name_of_disease: diseaseNameRef!.current!.value,
      deceased_uid: deceasedUidRef!.current!.value,
      father_name: fatherNameRef!.current!.value,
      mother_name: motherNameRef!.current!.value,
      wife_name: wifeNameRef!.current!.value,
      death_place_name: deathPlaceNameRef!.current!.value,
      current_address: currentAddressRef!.current!.value,
      permanent_address: permanentAddressRef!.current!.value,
      death_place_address: deathPlaceAddressRef!.current!.value,

      deceased_occupation: deceasedOccupationRef!.current!.value,
      pregnancy_death: pregnancyDeath,
      alcoholic_death: alcoholicDeath,
      smoker_death: smokerDeath,
      death_certified: deathCertified,

      iagree: isChecked ? "YES" : "NO",
      gender: gender,
      religion_deceased: religion,
      death_place: deathPlace,
      attender_type: attendentType,
    };

    const parsed = DeathRegisterScheme.safeParse(deathRegisterScheme);

    if (parsed.success) {
      if (sigimg == null || sigimg == undefined) {
        toast.error("Select Signature Image.", { theme: "light" });
      }
      const sign_url = await UploadFile(sigimg!);

      if (deceased_uid_url == null || deceased_uid_url == undefined) {
        toast.error("Upload Deceased Aadhar Card Copy", { theme: "light" });
      }
      const deceased_uid_urlt = await UploadFile(sigimg!);

      if (father_uid_url == null || father_uid_url == undefined) {
        toast.error("Upload Father Aadhar Card Copy.", { theme: "light" });
      }
      const father_uid_urlt = await UploadFile(sigimg!);

      if (authority_letter_url == null || authority_letter_url == undefined) {
        toast.error("Upload Authority Letter", { theme: "light" });
      }
      const authority_letter_urlt = await UploadFile(sigimg!);

      if (undertaking_url == null || undertaking_url == undefined) {
        toast.error("Upload Undertaking.", { theme: "light" });
      }
      const undertaking_urlt = await UploadFile(sigimg!);

      if (
        father_uid_urlt.status &&
        sign_url.status &&
        deceased_uid_urlt.status &&
        authority_letter_urlt.status &&
        undertaking_urlt.status
      ) {
        const data = await ApiCall({
          query: `
              mutation createDeathRegister($createDeathRegiserInput:CreateDeathRegiserInput!){
                createDeathRegister(createDeathRegiserInput:$createDeathRegiserInput){
                    id
                  }
                }
              `,
          veriables: {
            createDeathRegiserInput: {
              userId: Number(user.id),
              name: deathRegisterScheme.name,
              address: deathRegisterScheme.address,
              email: deathRegisterScheme.email,
              mobile: deathRegisterScheme.mobile,
              user_uid: deathRegisterScheme.user_uid,
              village_id: deathRegisterScheme.village_id,
              date_of_birth: deathRegisterScheme.date_of_birth,
              date_of_death: deathRegisterScheme.date_of_death,
              name_of_deceased: deathRegisterScheme.name_of_deceased,
              deceased_uid: deathRegisterScheme.deceased_uid,
              father_name: deathRegisterScheme.father_name,
              mother_name: deathRegisterScheme.mother_name,
              wife_name: deathRegisterScheme.wife_name,
              death_place_name: deathRegisterScheme.death_place_name,
              current_address: deathRegisterScheme.current_address,
              permanent_address: deathRegisterScheme.permanent_address,
              death_place_address: deathRegisterScheme.death_place_address,
              deceased_occupation: deathRegisterScheme.deceased_occupation,
              name_of_disease: deathRegisterScheme.name_of_disease,
              pregnancy_death: deathRegisterScheme.pregnancy_death,
              smoker_death: deathRegisterScheme.smoker_death,
              alcoholic_death: deathRegisterScheme.alcoholic_death,
              death_certified: deathRegisterScheme.death_certified,
              father_uid_url: father_uid_urlt.data,
              deceased_uid_url: deceased_uid_urlt.data,
              authority_letter_url: authority_letter_urlt.data,
              undertaking_url: undertaking_urlt.data,
              signature_url: sign_url.data,
              iagree: deathRegisterScheme.iagree,
              status: "ACTIVE",
              gender: deathRegisterScheme.gender,
              religion_deceased: deathRegisterScheme.religion_deceased,
              death_place: deathRegisterScheme.death_place,
              attender_type: deathRegisterScheme.attender_type,
            },
          },
        });

        if (!data.status) {
          toast.error(data.message, { theme: "light" });
        } else {
          navigator(
            `/home/dmc/newdeathregisterview/${data.data.createDeathRegister.id}`
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
  //5
  return (
    <>
      <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
        <h1 className="text-gray-800 text-3xl font-semibold text-center">
          New Death Register Application
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          Format of Application for registering a Death of a person.{" "}
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
            {/* <input
              ref={emailRef}
              placeholder="Applicant Email"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            /> */}
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

        {/*--------------------- section 2 end here ------------------------- */}

        {/*--------------------- section 3 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            3. Deceased Detail(s){" "}
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.1</span> Name of Deceased
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={nameOfDeceasedRef}
              placeholder="Name of Deceased"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.2</span> Date of Birth of Deceased
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={dateOfBirthRef}
              max={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.3</span> Gender of Deceased
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
            <span className="mr-2">3.4</span> Name of Father
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={fatherNameRef}
              placeholder="Name of Father"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.5</span> Mother Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={motherNameRef}
              placeholder=" Mother Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.6</span> Wife / Husband Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={wifeNameRef}
              placeholder="Wife / Husband Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.7</span> Deceased UID Details
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={deceasedUidRef}
              placeholder="Deceased UID Details"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.8</span> Death Place
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {BirthPlace.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setDeathPlace(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == deathPlace}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.9</span> Name of Death Place
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={deathPlaceNameRef}
              placeholder="Name of Death Place"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.10</span> Address of Death Place
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={deathPlaceAddressRef}
              placeholder="Address of Death Place"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            ></textarea>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.11</span> Current Address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={currentAddressRef}
              placeholder="Current Address"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            ></textarea>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.12</span> Permanent Address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={permanentAddressRef}
              placeholder="Permanent Address"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            ></textarea>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.13</span> Deceased Religion
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {Religion.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setReligion(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == religion}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.14</span>Name of Disease
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={diseaseNameRef}
              placeholder=" Name of Disease"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.16</span> Deceased Occupation
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={deceasedOccupationRef}
              placeholder="Deceased Occupation"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.18</span> Date of Death
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={dateOfDeathRef}
              max={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.21</span> Attender Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {AttendentType.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setAttendentType(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == attendentType}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.22</span> Pregnancy Death
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                setPregnancyDeath(true);
              }}
            >
              <input
                type="checkbox"
                checked={pregnancyDeath}
                className="accent-blue-500 scale-125"
              />
              <p className="text-md text-black font-medium">YES</p>
            </div>
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                setPregnancyDeath(false);
              }}
            >
              <input
                type="checkbox"
                checked={!pregnancyDeath}
                className="accent-blue-500 scale-125"
              />
              <p className="text-md text-black font-medium">NO</p>
            </div>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.23</span> Is Death Certified?
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                setDeathCertified(true);
              }}
            >
              <input
                type="checkbox"
                checked={deathCertified}
                className="accent-blue-500 scale-125"
              />
              <p className="text-md text-black font-medium">YES</p>
            </div>
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                setDeathCertified(false);
              }}
            >
              <input
                type="checkbox"
                checked={!deathCertified}
                className="accent-blue-500 scale-125"
              />
              <p className="text-md text-black font-medium">NO</p>
            </div>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.24</span> Smoker Death
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                setSmokerDeath(true);
              }}
            >
              <input
                type="checkbox"
                checked={smokerDeath}
                className="accent-blue-500 scale-125"
              />
              <p className="text-md text-black font-medium">YES</p>
            </div>
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                setSmokerDeath(false);
              }}
            >
              <input
                type="checkbox"
                checked={!smokerDeath}
                className="accent-blue-500 scale-125"
              />
              <p className="text-md text-black font-medium">NO</p>
            </div>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.25</span> Alcoholic Death
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                setAlcoholicDeath(true);
              }}
            >
              <input
                type="checkbox"
                checked={alcoholicDeath}
                className="accent-blue-500 scale-125"
              />
              <p className="text-md text-black font-medium">YES</p>
            </div>
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                setAlcoholicDeath(false);
              }}
            >
              <input
                type="checkbox"
                checked={!alcoholicDeath}
                className="accent-blue-500 scale-125"
              />
              <p className="text-md text-black font-medium">NO</p>
            </div>
          </div>
        </div>

        {/*--------------------- section 3 end here ------------------------- */}

        {/*--------------------- section 4 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            4. Document Attachment(s){" "}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.1</span> Father UIDAI Aadhaar Upload
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
            <span className="mr-2">4.2</span> Deceased UIDAI Aadhar Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={deceased_uid_url_Ref}
                onChange={(e) => handleLogoChange(e, setDeceased_uid_url)}
              />
            </div>
            <button
              onClick={() => deceased_uid_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {deceased_uid_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {deceased_uid_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(deceased_uid_url)}
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
            <span className="mr-2">4.3</span> Authority Letter Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={authority_letter_url_Ref}
                onChange={(e) => handleLogoChange(e, setAuthority_letter_url)}
              />
            </div>
            <button
              onClick={() => authority_letter_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {authority_letter_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {authority_letter_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(authority_letter_url)}
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
              href="/undertaking_dmc.pdf"
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
            5. Applicant Declaration and Signature{" "}
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

export default DeathRegister;
