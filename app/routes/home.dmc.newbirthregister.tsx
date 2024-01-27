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

const BirthRegister: React.FC = (): JSX.Element => {
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
  const [birthPlace, setBirthPlace] = useState<BirthPlace>("HOSPITAL");

  const AttendentType: string[] = [
    "DOCTOR",
    "NURSE",
    "DOMESTICEXPERT",
    "OTHER",
  ];
  type AttendentType = (typeof AttendentType)[number];
  const [attendentType, setAttendentType] = useState<AttendentType>("DOCTOR");

  const DeliveryMethod: string[] = ["NATURAL", "CSECTION", "VACCUM", "OTHER"];
  type DeliveryMethod = (typeof DeliveryMethod)[number];
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("NATURAL");

  const Religion: string[] = ["HINDU", "MUSLIM", "CHRISTIAN", "OTHER"];
  type Religion = (typeof Religion)[number];
  const [religion, setReligion] = useState<Religion>("HINDU");

  const dateOfBirthRef = useRef<HTMLInputElement>(null);

  const nameOfChildRef = useRef<HTMLInputElement>(null);
  const fatherNameRef = useRef<HTMLInputElement>(null);
  const motherNameRef = useRef<HTMLInputElement>(null);
  const grandFatherNameRef = useRef<HTMLInputElement>(null);
  const grandMotherNameRef = useRef<HTMLInputElement>(null);
  const birthPlaceNameRef = useRef<HTMLInputElement>(null);

  const currentAddressRef = useRef<HTMLTextAreaElement>(null);
  const permanentAddressRef = useRef<HTMLTextAreaElement>(null);

  const fatherEducationRef = useRef<HTMLInputElement>(null);
  const motherEducationRef = useRef<HTMLInputElement>(null);
  const fatherOccupationRef = useRef<HTMLInputElement>(null);
  const motherOccupationRef = useRef<HTMLInputElement>(null);

  const motherDateOfBirthRef = useRef<HTMLInputElement>(null);
  const dateOfMarriageRef = useRef<HTMLInputElement>(null);
  const previousChildCountRef = useRef<HTMLInputElement>(null);
  const weightTimeOfBirthRef = useRef<HTMLInputElement>(null);
  const noOfWeeksPregnantRef = useRef<HTMLInputElement>(null);

  // const remarkRef = useRef<HTMLInputElement>(null);

  const father_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [father_uid_url, setFather_uid_url] = useState<File>();

  const mother_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [mother_uid_url, setMother_uid_url] = useState<File>();

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

  const submit = async () => {
    const BirthRegisterScheme = z
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
        religion_child: z.string().nonempty("Select religion of Child"),
        attender_type: z.string().nonempty("Select Attender TYpe"),
        delivery_method: z.string().nonempty("Select Delivery Method"),
        birth_place: z.string().nonempty("Select Birth Place"),

        name_of_child: z.string().nonempty("Enter Name of Child"),
        father_name: z.string().nonempty("Enter Father Name"),
        mother_name: z.string().nonempty("Enter Mother Name"),
        grandfather_name: z.string().nonempty("Enter Grand Father Name"),
        grandmother_name: z.string().nonempty("Enter Grand Mother Name"),
        birth_place_name: z.string().nonempty("Enter Birth Place Name"),
        current_address: z.string().nonempty("Enter Current Address"),
        permanent_address: z.string().nonempty("Enter Permanent Address"),
        father_education: z.string().nonempty("Enter Father Education"),
        mother_education: z.string().nonempty("Enter Mother Education"),
        father_occupation: z.string().nonempty("Enter Father Occupation"),
        mother_occupation: z.string().nonempty("Enter Mother Occupation"),
        weight_of_child_at_birth: z
          .string()
          .nonempty("Enter Child Weight at Birth"),
        previous_child_count: z.string().nonempty("Enter Previous Child Count"),
        number_of_week_of_pregnency: z
          .string()
          .nonempty("Enter Number of weeks Pregnant"),

        date_of_birth: z.date({
          required_error: "Enter Date of Birth",
          invalid_type_error: "Enter a valid Date of Birth",
        }),
        mother_date_of_birth: z.date({
          required_error: "Enter Mother's Date of Birth",
          invalid_type_error: "Enter Mother's Date of Birth",
        }),
        date_of_marriage: z.date({
          required_error: "Enter Date of Marriage",
          invalid_type_error: "Enter Date of Marriage",
        }),

        iagree: z.string().nonempty("I solemnly affirm & hereby."),
      })
      .strict();

    type BirthRegisterScheme = z.infer<typeof BirthRegisterScheme>;

    const birthRegisterScheme: BirthRegisterScheme = {
      name: nameRef!.current!.value,
      address: addressRef!.current!.value,
      mobile: mobileRef!.current!.value,
      email: emailRef!.current!.value,
      user_uid: user.user_uid_four,
      village_id: parseInt(villageRef!.current!.value),
      date_of_birth: new Date(dateOfBirthRef!.current!.value),
      mother_date_of_birth: new Date(motherDateOfBirthRef!.current!.value),
      date_of_marriage: new Date(dateOfMarriageRef!.current!.value),
      name_of_child: nameOfChildRef!.current!.value,
      father_name: fatherNameRef!.current!.value,
      mother_name: motherNameRef!.current!.value,
      grandfather_name: grandFatherNameRef!.current!.value,
      grandmother_name: grandMotherNameRef!.current!.value,
      birth_place_name: birthPlaceNameRef!.current!.value,
      current_address: currentAddressRef!.current!.value,
      permanent_address: permanentAddressRef!.current!.value,
      father_education: fatherEducationRef!.current!.value,
      mother_education: motherEducationRef!.current!.value,
      father_occupation: fatherOccupationRef!.current!.value,
      mother_occupation: motherOccupationRef!.current!.value,
      weight_of_child_at_birth: weightTimeOfBirthRef!.current!.value,
      previous_child_count: previousChildCountRef!.current!.value,
      number_of_week_of_pregnency: noOfWeeksPregnantRef!.current!.value,

      iagree: isChecked ? "YES" : "NO",
      gender: gender,
      religion_child: religion,
      birth_place: birthPlace,
      attender_type: attendentType,
      delivery_method: deliveryMethod,
    };

    const parsed = BirthRegisterScheme.safeParse(birthRegisterScheme);

    if (parsed.success) {
      if (sigimg == null || sigimg == undefined) {
        toast.error("Select Signature Image.", { theme: "light" });
      }
      const sign_url = await UploadFile(sigimg!);

      if (mother_uid_url == null || mother_uid_url == undefined) {
        toast.error("Upload Mother Aadhar Card Copy", { theme: "light" });
      }
      const mother_uid_urlt = await UploadFile(sigimg!);

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
        mother_uid_urlt.status &&
        authority_letter_urlt.status &&
        undertaking_urlt.status
      ) {
        const data = await ApiCall({
          query: `
              mutation createBirthRegister($createBirthRegisterInput:CreateBirthRegisterInput!){
                createBirthRegister(createBirthRegisterInput:$createBirthRegisterInput){
                    id
                  }
                }
              `,
          veriables: {
            createBirthRegisterInput: {
              userId: Number(user.id),
              name: birthRegisterScheme.name,
              address: birthRegisterScheme.address,
              email: birthRegisterScheme.email,
              mobile: birthRegisterScheme.mobile,
              user_uid: birthRegisterScheme.user_uid,
              village_id: birthRegisterScheme.village_id,
              date_of_birth: birthRegisterScheme.date_of_birth,
              mother_date_of_birth: birthRegisterScheme.mother_date_of_birth,
              date_of_marriage: birthRegisterScheme.date_of_marriage,
              name_of_child: birthRegisterScheme.name_of_child,
              father_name: birthRegisterScheme.father_name,
              mother_name: birthRegisterScheme.mother_name,
              grandfather_name: birthRegisterScheme.grandfather_name,
              grandmother_name: birthRegisterScheme.grandmother_name,
              birth_place_name: birthRegisterScheme.birth_place_name,
              current_address: birthRegisterScheme.current_address,
              permanent_address: birthRegisterScheme.permanent_address,
              father_education: birthRegisterScheme.father_education,
              mother_education: birthRegisterScheme.mother_education,
              father_occupation: birthRegisterScheme.father_occupation,
              mother_occupation: birthRegisterScheme.mother_occupation,
              weight_of_child_at_birth:
                birthRegisterScheme.weight_of_child_at_birth,
              previous_child_count: birthRegisterScheme.previous_child_count,
              number_of_week_of_pregnency:
                birthRegisterScheme.number_of_week_of_pregnency,
              father_uid_url: father_uid_urlt.data,
              mother_uid_url: mother_uid_urlt.data,
              authority_letter_url: authority_letter_urlt.data,
              undertaking_url: undertaking_urlt.data,
              signature_url: sign_url.data,
              iagree: birthRegisterScheme.iagree,
              status: "ACTIVE",
              gender: birthRegisterScheme.gender,
              religion_child: birthRegisterScheme.religion_child,
              birth_place: birthRegisterScheme.birth_place,
              attender_type: birthRegisterScheme.attender_type,
              delivery_method: birthRegisterScheme.delivery_method,
            },
          },
        });
        if (!data.status) {
          toast.error(data.message, { theme: "light" });
        } else {
          navigator(
            `/home/dmc/newbirthregisterview/${data.data.createBirthRegister.id}`
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
          New Birth Register Application
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          Format of Application for registering a new Birth of Child.{" "}
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

        {/*--------------------- section 2 end here ------------------------- */}

        {/*--------------------- section 3 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            3. Child Detail(s){" "}
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.1</span> Name of Child
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={nameOfChildRef}
              placeholder="Name of Child"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.2</span> Date of Birth
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
            <span className="mr-2">3.3</span> Gender of Child
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
            <span className="mr-2">3.6</span> Grand Father Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={grandFatherNameRef}
              placeholder="Grand Father Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.7</span> Grand Mother Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={grandMotherNameRef}
              placeholder="Grand Mother Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.8</span> Birth Place
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {BirthPlace.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setBirthPlace(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == birthPlace}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.9</span> Name and Address of Place
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={birthPlaceNameRef}
              placeholder="Name of Place"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
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
            <span className="mr-2">3.13</span> Child Religion
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
            <span className="mr-2">3.14</span>Father Education
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={fatherEducationRef}
              placeholder=" Father Education"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.15</span> Mother Education
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={motherEducationRef}
              placeholder=" Father Education"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.16</span> Father Occupation
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={fatherOccupationRef}
              placeholder="Father Occupation"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.17</span> Mother Occupation
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={motherOccupationRef}
              placeholder="Mother Occupation"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.18</span> Mother's Date of Birth
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={motherDateOfBirthRef}
              max={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.19</span> Date of Marriage
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={dateOfMarriageRef}
              max={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.20</span> Number of Previous Child Count
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={previousChildCountRef}
              placeholder="Number of Previous Child Count"
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
            <span className="mr-2">3.22</span> Delivery Method
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {DeliveryMethod.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setDeliveryMethod(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == deliveryMethod}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.23</span> Weight of Child at time of Birth
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={weightTimeOfBirthRef}
              placeholder="Weight of Child"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.24</span> Number of Weeks Pregnant
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={noOfWeeksPregnantRef}
              placeholder="Number of Weeks Pregnant"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
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
            <span className="mr-2">4.2</span> Mother UIDAI Aadhar Upload
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
            <span className="mr-2">4.4</span> Undertaking
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

export default BirthRegister;
