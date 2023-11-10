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

const MarriageRegister: React.FC = (): JSX.Element => {
  const user = useLoaderData().user;
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const uidRef = useRef<HTMLInputElement>(null);

  const villageRef = useRef<HTMLSelectElement>(null);
  const [village, setVillage] = useState<any[]>([]);

  const Religion: string[] = ["HINDU", "MUSLIM", "CHRISTIAN", "OTHER"];
  type Religion = (typeof Religion)[number];

  const [groomReligion, setGroomReligion] = useState<Religion>("HINDU");

  const [brideReligion, setBrideReligion] = useState<Religion>("HINDU");
  // const [religion, setReligion] = useState<Religion>("HINDU");

  const groomNameRef = useRef<HTMLInputElement>(null);
  const brideNameRef = useRef<HTMLInputElement>(null);

  const groomDateOfBirthRef = useRef<HTMLInputElement>(null);
  const brideDateOfBirthRef = useRef<HTMLInputElement>(null);
  const dateOfMarriageRef = useRef<HTMLInputElement>(null);

  const groomFatherNameRef = useRef<HTMLInputElement>(null);
  const groomMotherNameRef = useRef<HTMLInputElement>(null);
  const brideFatherNameRef = useRef<HTMLInputElement>(null);
  const brideMotherNameRef = useRef<HTMLInputElement>(null);

  const groomAddressRef = useRef<HTMLTextAreaElement>(null);
  const brideAddressRef = useRef<HTMLTextAreaElement>(null);

  const witnessOneRef = useRef<HTMLInputElement>(null);
  const witnessTwoRef = useRef<HTMLInputElement>(null);
  const witnessThreeRef = useRef<HTMLInputElement>(null);

  const remarkRef = useRef<HTMLInputElement>(null);

  const joint_bride_groom_photo_url_Ref = useRef<HTMLInputElement>(null);
  const [joint_bride_groom_photo_url, setJoint_bride_groom_photo_url] =
    useState<File>();

  const applicant_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [applicant_uid_url, setApplicant_uid_url] = useState<File>();

  const bride_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [bride_uid_url, setBride_uid_url] = useState<File>();

  const groom_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [groom_uid_url, setGroom_uid_url] = useState<File>();

  const witness_one_signature_url_Ref = useRef<HTMLInputElement>(null);
  const [witness_one_signature_url, setWitness_one_signature_url] =
    useState<File>();

  const witness_two_signature_url_Ref = useRef<HTMLInputElement>(null);
  const [witness_two_signature_url, setWitness_two_signature_url] =
    useState<File>();

  const witness_three_signature_url_Ref = useRef<HTMLInputElement>(null);
  const [witness_three_signature_url, setWitness_three_signature_url] =
    useState<File>();

  const undertaking_url_Ref = useRef<HTMLInputElement>(null);
  const [undertaking_url, setUndertaking_url] = useState<File>();

  const groom_signature_url_Ref = useRef<HTMLInputElement>(null);
  const [groom_signature_url, setGroom_signature_url] = useState<File>();

  const bride_signature_url_Ref = useRef<HTMLInputElement>(null);
  const [bride_signature_url, setBride_signature_url] = useState<File>();

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
    const MarriageRegisterScheme = z
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
        }),

        religion_bride: z.string().nonempty("Select religion of Bride"),
        religion_groom: z.string().nonempty("Select religion of Groom"),

        groom_name: z.string().nonempty("Enter Name of Groom"),
        groom_father_name: z.string().nonempty("Enter Groom's Father Name"),
        groom_mother_name: z.string().nonempty("Enter Groom's Mother Name"),
        bride_name: z.string().nonempty("Enter Bride's Name"),
        bride_father_name: z.string().nonempty("Enter Bride's Father Name"),
        bride_mother_name: z.string().nonempty("Enter Bride's Mother Name"),
        witness_one_details: z.string().nonempty("Enter Name of Witness 1"),
        witness_two_details: z.string().nonempty("Enter Name of Witness 2"),
        witness_three_details: z.string().nonempty("Enter Name of Witness 3"),

        groom_address: z.string().nonempty("Enter Groom's Address"),
        bride_address: z.string().nonempty("Enter Bride's Address"),

        groom_date_of_birth: z.date({
          required_error: "Enter Groom's Date of Birth",
          invalid_type_error: "Enter a valid Date",
        }),
        bride_date_of_birth: z.date({
          required_error: "Enter Bride's Date of Birth",
          invalid_type_error: "Enter a valid Date",
        }),
        date_of_marriage: z.date({
          required_error: "Enter Date of Marriage",
          invalid_type_error: "Enter a valid Date",
        }),

        iagree: z.string().nonempty("I solemnly affirm & hereby."),
      })
      .strict();

    type MarriageRegisterScheme = z.infer<typeof MarriageRegisterScheme>;

    const marriageRegisterScheme: MarriageRegisterScheme = {
      name: nameRef!.current!.value,
      address: addressRef!.current!.value,
      mobile: mobileRef!.current!.value,
      email: emailRef!.current!.value,
      user_uid: uidRef!.current!.value,
      village_id: parseInt(villageRef!.current!.value),

      groom_date_of_birth: new Date(groomDateOfBirthRef!.current!.value),
      bride_date_of_birth: new Date(brideDateOfBirthRef!.current!.value),
      date_of_marriage: new Date(dateOfMarriageRef!.current!.value),
      groom_name: groomNameRef!.current!.value,
      groom_father_name: groomFatherNameRef!.current!.value,
      groom_mother_name: groomMotherNameRef!.current!.value,
      bride_name: brideNameRef!.current!.value,
      bride_father_name: brideFatherNameRef!.current!.value,
      bride_mother_name: brideMotherNameRef!.current!.value,
      groom_address: groomAddressRef!.current!.value,
      bride_address: brideAddressRef!.current!.value,
      witness_one_details: witnessOneRef!.current!.value,
      witness_two_details: witnessTwoRef!.current!.value,
      witness_three_details: witnessThreeRef!.current!.value,

      iagree: isChecked ? "YES" : "NO",

      religion_bride: brideReligion,
      religion_groom: groomReligion,
    };

    const parsed = MarriageRegisterScheme.safeParse(marriageRegisterScheme);

    if (parsed.success) {
      if (sigimg == null || sigimg == undefined) {
        toast.error("Select Signature Image.", { theme: "light" });
      }
      const sign_url = await UploadFile(sigimg!);

      if (
        joint_bride_groom_photo_url == null ||
        joint_bride_groom_photo_url == undefined
      ) {
        toast.error("Upload Mother Aadhar Card Copy", { theme: "light" });
      }
      const joint_bride_groom_photo_urlt = await UploadFile(sigimg!);

      if (applicant_uid_url == null || applicant_uid_url == undefined) {
        toast.error("Upload Father Aadhar Card Copy.", { theme: "light" });
      }
      const applicant_uid_urlt = await UploadFile(sigimg!);

      if (groom_uid_url == null || groom_uid_url == undefined) {
        toast.error("Upload Authority Letter", { theme: "light" });
      }
      const groom_uid_urlt = await UploadFile(sigimg!);

      if (
        witness_one_signature_url == null ||
        witness_one_signature_url == undefined
      ) {
        toast.error("Upload Undertaking.", { theme: "light" });
      }
      const witness_one_signature_urlt = await UploadFile(sigimg!);

      if (
        witness_two_signature_url == null ||
        witness_two_signature_url == undefined
      ) {
        toast.error("Upload Mother Aadhar Card Copy", { theme: "light" });
      }
      const witness_two_signature_urlt = await UploadFile(sigimg!);

      if (
        witness_three_signature_url == null ||
        witness_three_signature_url == undefined
      ) {
        toast.error("Upload Father Aadhar Card Copy.", { theme: "light" });
      }
      const witness_three_signature_urlt = await UploadFile(sigimg!);

      if (groom_signature_url == null || groom_signature_url == undefined) {
        toast.error("Upload Authority Letter", { theme: "light" });
      }
      const groom_signature_urlt = await UploadFile(sigimg!);

      if (undertaking_url == null || undertaking_url == undefined) {
        toast.error("Upload Undertaking.", { theme: "light" });
      }
      const undertaking_urlt = await UploadFile(sigimg!);

      if (bride_uid_url == null || bride_uid_url == undefined) {
        toast.error("Upload Authority Letter", { theme: "light" });
      }
      const bride_uid_urlt = await UploadFile(sigimg!);

      if (bride_signature_url == null || bride_signature_url == undefined) {
        toast.error("Upload Undertaking.", { theme: "light" });
      }
      const bride_signature_urlt = await UploadFile(sigimg!);

      if (
        joint_bride_groom_photo_urlt.status &&
        sign_url.status &&
        applicant_uid_urlt.status &&
        groom_uid_urlt.status &&
        witness_one_signature_urlt.status &&
        witness_two_signature_urlt.status &&
        witness_three_signature_urlt.status &&
        groom_signature_urlt.status &&
        bride_uid_urlt.status &&
        bride_signature_urlt.status &&
        undertaking_urlt.status
      ) {
        const data = await ApiCall({
          query: `
              mutation createMarriageRegister($createMarriageRegisterInput:CreateMarriageRegisterInput!){
                createMarriageRegister(createMarriageRegisterInput:$createMarriageRegisterInput){
                    id
                  }
                }
              `,
          veriables: {
            createMarriageRegisterInput: {
              userId: Number(user.id),
              name: marriageRegisterScheme.name,
              address: marriageRegisterScheme.address,
              email: marriageRegisterScheme.email,
              mobile: marriageRegisterScheme.mobile,
              user_uid: marriageRegisterScheme.user_uid,
              village_id: marriageRegisterScheme.village_id,

              groom_date_of_birth: marriageRegisterScheme.groom_date_of_birth,
              bride_date_of_birth: marriageRegisterScheme.bride_date_of_birth,
              date_of_marriage: marriageRegisterScheme.date_of_marriage,

              name_of_child: marriageRegisterScheme.groom_name,
              groom_father_name: marriageRegisterScheme.groom_father_name,
              groom_mother_name: marriageRegisterScheme.groom_mother_name,
              bride_name: marriageRegisterScheme.bride_name,
              bride_father_name: marriageRegisterScheme.bride_father_name,
              bride_mother_name: marriageRegisterScheme.bride_mother_name,
              groom_address: marriageRegisterScheme.groom_address,
              bride_address: marriageRegisterScheme.bride_address,
              religion_groom: marriageRegisterScheme.religion_groom,
              religion_bride: marriageRegisterScheme.religion_bride,
              witness_one_details: marriageRegisterScheme.witness_one_details,
              witness_two_details: marriageRegisterScheme.witness_two_details,
              witness_three_details:
                marriageRegisterScheme.witness_three_details,

              witness_one_signature_url: witness_one_signature_urlt.data,
              witness_two_signature_url: witness_two_signature_urlt.data,
              witness_three_signature_url: witness_three_signature_urlt.data,
              undertaking_url: undertaking_urlt.data,
              groom_signature_url: groom_signature_urlt.data,
              bride_signature_url: bride_signature_urlt.data,
              joint_bride_groom_photo_url: joint_bride_groom_photo_urlt.data,
              applicant_uid_url: applicant_uid_urlt.data,
              bride_uid_url: bride_uid_urlt.data,
              groom_uid_url: groom_uid_urlt.data,
              signature_url: sign_url.data,
              iagree: marriageRegisterScheme.iagree,
              status: "ACTIVE",
            },
          },
        });
        if (!data.status) {
          toast.error(data.message, { theme: "light" });
        } else {
          navigator(
            `/home/crsr/marriageregisterview/${data.data.createMarriageRegister.id}`
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
          New Marriage Register Application
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          Format of Application for registering a new Marriage.{" "}
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
            3. Marriage Detail(s){" "}
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.1</span> Name of Groom
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={groomNameRef}
              placeholder="Name of Groom"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.2</span> Date of Birth of Groom
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={groomDateOfBirthRef}
              min={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.4</span> Name of Groom's Father
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={groomFatherNameRef}
              placeholder="Name of Father"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.5</span> Groom's Mother Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={groomMotherNameRef}
              placeholder=" Mother Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.6</span> Bride's Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={brideNameRef}
              placeholder="Bride's Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.7</span> Bride's Father Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={brideFatherNameRef}
              placeholder="Father Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.9</span> Bride's Mother Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={brideMotherNameRef}
              placeholder="Mother Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.11</span> Groom's Address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={groomAddressRef}
              placeholder="Groom's Address"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            ></textarea>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.12</span> Bride's Address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={brideAddressRef}
              placeholder="Bride's Address"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            ></textarea>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.13</span> Groom's Religion
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {Religion.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setGroomReligion(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == groomReligion}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.13</span> Bride's Religion
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {Religion.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setBrideReligion(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == brideReligion}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.14</span>Witness 1 Details
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={witnessOneRef}
              placeholder="Witness 1 Details"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.15</span>Witness 2 Details
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={witnessTwoRef}
              placeholder="Witness 2 Details"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.16</span>Witness 3 Details
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={witnessThreeRef}
              placeholder="Witness 3 Details"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.18</span> Groom's Date of Birth
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={groomDateOfBirthRef}
              min={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.18</span> Bride's Date of Birth
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={brideDateOfBirthRef}
              min={new Date().toISOString().split("T")[0]}
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
            <span className="mr-2">4.2</span> Groom's UIDAI Aadhaar Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={groom_uid_url_Ref}
                onChange={(e) => handleLogoChange(e, setGroom_uid_url)}
              />
            </div>
            <button
              onClick={() => groom_uid_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {groom_uid_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {groom_uid_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(groom_uid_url)}
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
            <span className="mr-2">4.3</span> Bride's UIDAI Aadhaar Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={bride_uid_url_Ref}
                onChange={(e) => handleLogoChange(e, setBride_uid_url)}
              />
            </div>
            <button
              onClick={() => bride_uid_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {bride_uid_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {bride_uid_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(bride_uid_url)}
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
            <span className="mr-2">4.2</span> Groom's Signature Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={groom_signature_url_Ref}
                onChange={(e) => handleLogoChange(e, setGroom_signature_url)}
              />
            </div>
            <button
              onClick={() => groom_signature_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {groom_signature_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {groom_signature_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(groom_signature_url)}
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
            <span className="mr-2">4.3</span> Bride's Signature Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={bride_signature_url_Ref}
                onChange={(e) => handleLogoChange(e, setBride_signature_url)}
              />
            </div>
            <button
              onClick={() => bride_signature_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {bride_signature_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {bride_signature_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(bride_signature_url)}
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
            <span className="mr-2">4.2</span> Joint Bride and Groom Photo Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={joint_bride_groom_photo_url_Ref}
                onChange={(e) =>
                  handleLogoChange(e, setJoint_bride_groom_photo_url)
                }
              />
            </div>
            <button
              onClick={() => joint_bride_groom_photo_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {joint_bride_groom_photo_url == null
                  ? "Attach Doc."
                  : "Update Doc."}
              </div>
            </button>
            {joint_bride_groom_photo_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(joint_bride_groom_photo_url)}
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
            <span className="mr-2">4.3</span> Witness 1 Signature Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={witness_one_signature_url_Ref}
                onChange={(e) =>
                  handleLogoChange(e, setWitness_one_signature_url)
                }
              />
            </div>
            <button
              onClick={() => witness_one_signature_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {witness_one_signature_url == null
                  ? "Attach Doc."
                  : "Update Doc."}
              </div>
            </button>
            {witness_one_signature_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(witness_one_signature_url)}
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
            <span className="mr-2">4.3</span> Witness 2 Signature Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={witness_two_signature_url_Ref}
                onChange={(e) =>
                  handleLogoChange(e, setWitness_two_signature_url)
                }
              />
            </div>
            <button
              onClick={() => witness_two_signature_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {witness_two_signature_url == null
                  ? "Attach Doc."
                  : "Update Doc."}
              </div>
            </button>
            {witness_two_signature_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(witness_two_signature_url)}
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
            <span className="mr-2">4.3</span> Witness 3 Signature Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={witness_three_signature_url_Ref}
                onChange={(e) =>
                  handleLogoChange(e, setWitness_three_signature_url)
                }
              />
            </div>
            <button
              onClick={() => witness_three_signature_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {witness_three_signature_url == null
                  ? "Attach Doc."
                  : "Update Doc."}
              </div>
            </button>
            {witness_three_signature_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(witness_three_signature_url)}
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

export default MarriageRegister;
