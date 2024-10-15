import { useEffect, useRef, useState } from "react";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { toast } from "react-toastify";
import { z } from "zod";
import { ApiCall, UploadFile } from "~/services/api";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
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

const NewRationCard: React.FC = (): JSX.Element => {
  const user = useLoaderData().user;
  const nameRef = useRef<HTMLInputElement>(null);
  const fatherRef = useRef<HTMLInputElement>(null);
  const motherRef = useRef<HTMLInputElement>(null);
  const spouseRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const oldrationcardRef = useRef<HTMLInputElement>(null);
  const eidRef = useRef<HTMLInputElement>(null);

  const CardType: string[] = ["APL", "BPL", "AAY", "AAP"];
  type CardType = (typeof CardType)[number];
  const [cardType, setCardType] = useState<CardType>("APL");

  const Gender: string[] = ["MALE", "FEMALE", "OTHER"];
  type Gender = (typeof Gender)[number];
  const [gender, setGender] = useState<Gender>("MALE");

  const dateOfBirthRef = useRef<HTMLInputElement>(null);

  const villageRef = useRef<HTMLSelectElement>(null);
  const [village, setVillage] = useState<any[]>([]);

  const occupationRef = useRef<HTMLInputElement>(null);
  const annualIncomeRef = useRef<HTMLInputElement>(null);

  const GasConnection: string[] = ["DEEPAM", "DOUBLE", "SINGLE", "NOCYLINDER"];
  type GasConnection = (typeof GasConnection)[number];
  const [gasConnection, setGasConnection] = useState<GasConnection>("DEEPAM");

  const gascompanynameRef = useRef<HTMLInputElement>(null);
  const gasagencynameRef = useRef<HTMLInputElement>(null);
  const consumernoRef = useRef<HTMLInputElement>(null);

  const addressRef = useRef<HTMLTextAreaElement>(null);
  const districtRef = useRef<HTMLInputElement>(null);
  const mandalRef = useRef<HTMLInputElement>(null);
  const pincodeRef = useRef<HTMLInputElement>(null);

  const pvillageRef = useRef<HTMLSelectElement>(null);
  const paddressRef = useRef<HTMLTextAreaElement>(null);
  const pdistrictRef = useRef<HTMLInputElement>(null);
  const pmandalRef = useRef<HTMLInputElement>(null);
  const ppincodeRef = useRef<HTMLInputElement>(null);

  const deliverytypeRef = useRef<HTMLInputElement>(null);
  const informantrelationRef = useRef<HTMLInputElement>(null);
  const informantnameRef = useRef<HTMLInputElement>(null);
  const mobilenoRef = useRef<HTMLInputElement>(null);

  const applicant_uid_url_Ref = useRef<HTMLInputElement>(null);
  const [applicant_uid_url, setApplicant_uid_url] = useState<File>();

  const gas_connection_url_Ref = useRef<HTMLInputElement>(null);
  const [gas_connection_url, setGas_connection_url] = useState<File>();

  const resident_proof_url_Ref = useRef<HTMLInputElement>(null);
  const [resident_proof_url, setResident_proof_url] = useState<File>();

  const photo_url_Ref = useRef<HTMLInputElement>(null);
  const [photo_url, setPhoto_url] = useState<File>();

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
    const NewRationCardConnectScheme = z
      .object({
        card_type: z.string().nonempty("Applicant Card type Name is required."),
        name: z.string().nonempty("Applicant Name is required."),
        mobile: z
          .string()
          .nonempty("Applicant Contact Number is required.")
          .length(10, "Mobile Number shoule be 10 digit."),
        email: z.string().email("Enter a valid email.").optional(),
        user_uid: z.string().optional(),
        user_eid: z.string().optional(),
        spouse_name: z.string().optional(),
        old_ration_card_number: z.string().optional(),
        age: z.string().nonempty("Applicant Age is required."),
        mother_name: z.string().nonempty("Applicant Mother Name is required."),
        father_name: z.string().nonempty("Applicant Father Name is required."),
        gender: z.string().nonempty("Applicant Gender is required."),
        date_of_birth: z.date({
          required_error: "Enter date of birth",
          invalid_type_error: "Enter a valid date of birth",
        }),

        occupation: z.string().nonempty("Applicant occupation is required."),
        annual_income: z
          .string()
          .nonempty("Applicant annual income is required."),

        gasconnection: z
          .string()
          .nonempty("Gas Connection Type address is required."),
        gas_company_name: z.string().nonempty("Gas Company Name is required."),
        gas_agency_name: z.string().nonempty("Gas Agency Name is required."),
        consumer_no: z.string().nonempty("Consumer number is required."),

        village_id: z
          .number({
            invalid_type_error: "Select a valid village",
            required_error: "Select a village",
          })
          .refine((val) => val != 0, {
            message: "Please select village",
          }),
        address: z.string().nonempty("Applicant address is required."),
        district: z.string().nonempty("Applicant district is required."),
        pincode: z.string().nonempty("Applicant Pincode is required."),
        mandal: z.string().nonempty("Applicant Mandal is required."),

        pmandal: z.string().nonempty("Applicant Permanent Mandal is required."),
        ppincode: z
          .string()
          .nonempty("Applicant Permanent Pincode is required."),
        pdistrict: z
          .string()
          .nonempty("Applicant Permanent district is required."),
        paddress: z
          .string()
          .nonempty("Permanent Applicant address is required."),
        pvillage_id: z
          .number({
            invalid_type_error: "Select a valid permanent village",
            required_error: "Select a permanent village",
          })
          .refine((val) => val != 0, {
            message: "Please select permanent village",
          }),

        informate_name: z.string().nonempty("Informate Name is required."),
        informant_relation: z
          .string()
          .nonempty("Informate Relation  is required."),
        delivery_type: z.string().nonempty("Delivery Type is required."),
        mobile_no: z.string().nonempty("Mobile No Mandal is required."),

        iagree: z.string().nonempty("I solemnly affirm & hereby."),
      })
      .strict();

    type NewRationCardConnectScheme = z.infer<
      typeof NewRationCardConnectScheme
    >;

    const newRationCardConnectScheme: NewRationCardConnectScheme = {
      card_type: cardType,
      name: nameRef!.current!.value,
      father_name: fatherRef!.current!.value,
      mother_name: motherRef!.current!.value,
      spouse_name: spouseRef!.current!.value,
      gender: gender,
      date_of_birth: new Date(dateOfBirthRef!.current!.value),
      mobile: mobileRef!.current!.value,
      email: emailRef!.current!.value,
      user_uid: user.user_uid_four,
      user_eid: eidRef!.current!.value,
      age: ageRef!.current!.value,
      old_ration_card_number: oldrationcardRef!.current!.value,
      occupation: occupationRef!.current!.value,
      annual_income: annualIncomeRef!.current!.value,
      gasconnection: gasConnection,
      gas_company_name: gascompanynameRef!.current!.value,
      gas_agency_name: gasagencynameRef!.current!.value,
      consumer_no: consumernoRef!.current!.value,
      address: addressRef!.current!.value,
      paddress: paddressRef!.current!.value,
      district: deliverytypeRef!.current!.value,
      pdistrict: pdistrictRef!.current!.value,
      mandal: mandalRef!.current!.value,
      pmandal: pmandalRef!.current!.value,
      pincode: pincodeRef!.current!.value,
      ppincode: ppincodeRef!.current!.value,
      village_id: parseInt(villageRef!.current!.value),
      pvillage_id: parseInt(pvillageRef!.current!.value),
      informant_relation: informantrelationRef!.current!.value,
      informate_name: informantnameRef!.current!.value,
      delivery_type: deliverytypeRef!.current!.value,
      mobile_no: mobilenoRef!.current!.value,
      iagree: isChecked ? "YES" : "NO",
    };

    const parsed = NewRationCardConnectScheme.safeParse(
      newRationCardConnectScheme
    );

    if (parsed.success) {
      if (sigimg == null || sigimg == undefined) {
        toast.error("Select Signature Image.", { theme: "light" });
      }
      const sign_url = await UploadFile(sigimg!);

      if (photo_url == null || photo_url == undefined) {
        toast.error("Upload Applicant Photo.", { theme: "light" });
      }
      const photo_urlt = await UploadFile(photo_url!);

      if (gas_connection_url == null || gas_connection_url == undefined) {
        toast.error("Upload Gas Connnection Copy.", { theme: "light" });
      }
      const gas_connection_urlt = await UploadFile(gas_connection_url!);

      if (applicant_uid_url == null || applicant_uid_url == undefined) {
        toast.error("Upload Applicant UID.", { theme: "light" });
      }
      const applicant_uid_urlt = await UploadFile(applicant_uid_url!);

      if (resident_proof_url == null || resident_proof_url == undefined) {
        toast.error("Upload Resident Proof Copy.", { theme: "light" });
      }
      const resident_proof_urlt = await UploadFile(resident_proof_url!);

      if (
        photo_urlt.status &&
        sign_url.status &&
        gas_connection_urlt.status &&
        applicant_uid_urlt.status &&
        resident_proof_urlt.status
      ) {
        const data = await ApiCall({
          query: `
              mutation createRationCard($createNewrationcardInput:CreateNewrationcardInput!){
                createRationCard(createNewrationcardInput:$createNewrationcardInput){
                    id
                  }
                }
              `,
          veriables: {
            createNewrationcardInput: {
              userId: Number(user.id),
              mobile: newRationCardConnectScheme.mobile,
              email: newRationCardConnectScheme.email,
              card_type: newRationCardConnectScheme.card_type,
              user_uid: newRationCardConnectScheme.user_uid,
              user_eid: newRationCardConnectScheme.user_eid,
              name: newRationCardConnectScheme.name,
              mother_name: newRationCardConnectScheme.mother_name,
              father_name: newRationCardConnectScheme.father_name,
              spouse_name: newRationCardConnectScheme.spouse_name,
              gender: newRationCardConnectScheme.gender,
              date_of_birth: newRationCardConnectScheme.date_of_birth,
              age: newRationCardConnectScheme.age,
              occupation: newRationCardConnectScheme.occupation,
              annual_income: newRationCardConnectScheme.occupation,
              gasconnection: newRationCardConnectScheme.gasconnection,
              gas_company_name: newRationCardConnectScheme.gas_company_name,
              gas_agency_name: newRationCardConnectScheme.gas_agency_name,
              consumer_no: newRationCardConnectScheme.consumer_no,
              address: newRationCardConnectScheme.address,
              paddress: newRationCardConnectScheme.paddress,
              village_id: newRationCardConnectScheme.village_id,
              pvillage_id: newRationCardConnectScheme.pvillage_id,
              pin_code: newRationCardConnectScheme.pincode,
              ppin_code: newRationCardConnectScheme.ppincode,
              mandal: newRationCardConnectScheme.mandal,
              pmandal: newRationCardConnectScheme.pmandal,
              district: newRationCardConnectScheme.district,
              pdistrict: newRationCardConnectScheme.pdistrict,
              old_ration_card_number:
                newRationCardConnectScheme.old_ration_card_number,
              informate_name: newRationCardConnectScheme.informate_name,
              informant_relation: newRationCardConnectScheme.informant_relation,
              delivery_type: newRationCardConnectScheme.delivery_type,
              mobile_no: newRationCardConnectScheme.mobile_no,
              photo: photo_urlt.data,
              proof_one: gas_connection_urlt.data,
              proof_two: resident_proof_urlt.data,
              proof_three: applicant_uid_urlt.data,
              signature_url: sign_url.data,
              iagree: newRationCardConnectScheme.iagree,

              status: "ACTIVE",
            },
          },
        });
        if (!data.status) {
          toast.error(data.message, { theme: "light" });
        } else {
          const memberdata = await ApiCall({
            query: `
                  mutation createMultipalRationMember($createMultipalNewrationcardmemberInput:CreateMultipalNewrationcardmemberInput!){
                    createMultipalRationMember(createMultipalNewrationcardmemberInput:$createMultipalNewrationcardmemberInput){
                        id
                      }
                    }
                  `,
            veriables: {
              createMultipalNewrationcardmemberInput: {
                members: member.map((val) => ({
                  ...val,
                  status: "ACTIVE",
                  userId: Number(data.data.createRationCard.id),
                })),
              },
            },
          });

          if (memberdata.status) {
            navigator(
              `/home/fcs/issuenewrationcardview/${data.data.createRationCard.id}`
            );
          } else {
            toast.error(memberdata.message, { theme: "light" });
          }
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

  interface Members {
    name: string;
    gender: string;
    date_of_birth: Date;
    mother_name: string;
    father_name: string;
    spouse_name?: string;
    option_to_life_commodity: boolean;
    age: string;
    uid: string;
    eid: string;
    relationship_with_head_of_family: string;
  }

  const mnameRef = useRef<HTMLInputElement>(null);
  const mfatherRef = useRef<HTMLInputElement>(null);
  const mmotherRef = useRef<HTMLInputElement>(null);
  const mspouseRef = useRef<HTMLInputElement>(null);
  const mageRef = useRef<HTMLInputElement>(null);
  const meidRef = useRef<HTMLInputElement>(null);
  const muidRef = useRef<HTMLInputElement>(null);
  const [option_to_life_commodityRef, setOption_to_life_commodity] =
    useState<boolean>(false);
  const relationshipwithheadRef = useRef<HTMLInputElement>(null);

  const [mgender, setMGender] = useState<Gender>("MALE");
  const mdateOfBirthRef = useRef<HTMLInputElement>(null);

  const [member, setMember] = useState<Members[]>([]);

  const removeMember = (index: number) => {
    setMember((prevMembers) => {
      // Create a copy of the previous members array
      const updatedMembers = [...prevMembers];

      // Remove the member at the specified index
      updatedMembers.splice(index, 1);

      // Return the updated array to update the state
      return updatedMembers;
    });
  };

  const addMember = () => {
    const NewMemberScheme = z
      .object({
        name: z.string().nonempty("Applicant Name is required."),
        uid: z.string().optional(),
        eid: z.string().optional(),
        gender: z.string().nonempty("Applicant Gender is required."),
        date_of_birth: z.date({
          required_error: "Enter date of birth",
          invalid_type_error: "Enter a valid date of birth",
        }),
        mother_name: z.string().nonempty("Applicant Mother Name is required."),
        father_name: z.string().nonempty("Applicant Father Name is required."),
        spouse_name: z.string().optional(),
        option_to_life_commodity: z.boolean({
          message: "Select option ot life commodity",
          required_error: "Option to life commodity is required",
        }),
        age: z.string().nonempty("Applicant Age is required."),

        relationship_with_head_of_family: z
          .string()
          .nonempty(
            "Applicant Relationship with head of family is required is required."
          ),
      })
      .strict();

    type NewMemberScheme = z.infer<typeof NewMemberScheme>;

    const newMemberScheme: Members = {
      name: mnameRef!.current!.value,
      father_name: mfatherRef!.current!.value,
      mother_name: mmotherRef!.current!.value,
      spouse_name: mspouseRef.current?.value || "",
      gender: mgender,
      date_of_birth: new Date(mdateOfBirthRef!.current!.value),
      uid: muidRef.current?.value || "",
      eid: meidRef.current?.value || "",
      age: mageRef!.current!.value,
      relationship_with_head_of_family: relationshipwithheadRef!.current!.value,
      option_to_life_commodity: option_to_life_commodityRef,
    };

    const parsed = NewMemberScheme.safeParse(newMemberScheme);

    if (parsed.success) {
      setMember((prevMembers) => [...prevMembers, newMemberScheme]);
      toast.success("Member added successfully!", { theme: "light" });
      // Call your existing function to save this new member to state

      // Clear the input fields after adding the member
      if (mnameRef.current) mnameRef.current.value = "";
      if (mfatherRef.current) mfatherRef.current.value = "";
      if (mmotherRef.current) mmotherRef.current.value = "";
      if (mspouseRef.current) mspouseRef.current.value = "";
      if (mdateOfBirthRef.current) mdateOfBirthRef.current.value = "";
      if (muidRef.current) muidRef.current.value = "";
      if (meidRef.current) meidRef.current.value = "";
      if (mageRef.current) mageRef.current.value = "";
      if (relationshipwithheadRef.current)
        relationshipwithheadRef.current.value = "";

      setMGender("MALE");
      setOption_to_life_commodity(false);
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };

  return (
    <>
      <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
        <h1 className="text-gray-800 text-2xl font-semibold text-center">
          Issue New Ration Card Connection Application
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          Format of Application for obtaining New Ration Card Connection.
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
            <span className="mr-2">2.1</span> Card Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {CardType.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setCardType(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == cardType}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">{val}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.2</span> Applicant Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={nameRef}
              placeholder="Applicant Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.3</span> Applicant Father Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={fatherRef}
              placeholder="Applicant Father Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.4</span> Applicant Mother Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={motherRef}
              placeholder="Applicant Mother Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.5</span> Applicant Spouse Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={spouseRef}
              placeholder="Applicant Spouse Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.6</span> Gender
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
            <span className="mr-2">2.7</span> Date of Birth
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
            <span className="mr-2">2.8</span> Applicant Contact Number
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
            <span className="mr-2">2.9</span> Applicant Email
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
            <span className="mr-2">2.10</span> Applicant UID
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
            <span className="mr-2">2.11</span> Applicant EID
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={eidRef}
              placeholder="Applicant EID"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.12</span> Applicant Age
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={ageRef}
              placeholder="Applicant Age"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.13</span> Old Ration Card No. (If any)
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={oldrationcardRef}
              placeholder="Old Ration Card No."
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        {/*--------------------- section 2 end here ------------------------- */}

        {/*--------------------- section 3 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            3. Professional Details(s)
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.1</span> Occupation
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={occupationRef}
              placeholder="Applicant Occupation"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.2</span> Annual Income
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={annualIncomeRef}
              placeholder="Applicant Annual Income"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        {/*--------------------- section 3 end here ------------------------- */}

        {/*--------------------- section 4 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            4. Gas Connection Details
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">4.1</span> Gas Connection Status
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
            {GasConnection.map((val: string, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  setGasConnection(val);
                }}
              >
                <input
                  type="checkbox"
                  checked={val == gasConnection}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">
                  {val == "NOCYLINDER" ? "NO CYLINDER" : val}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">4.2</span> Gas Company Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={gascompanynameRef}
              placeholder="Gas Company Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">4.3</span> Gas Agency Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={gasagencynameRef}
              placeholder="Gas Agency Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">4.4</span> Consumer No
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={consumernoRef}
              placeholder="Consumer No"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        {/*--------------------- section 4 end here ------------------------- */}

        {/*--------------------- section 5 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            5. Residence Address
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">5.1</span> Address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={addressRef}
              placeholder="Address"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            ></textarea>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">5.2</span> District
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={districtRef}
              placeholder="District"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">5.3</span> Mandal
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={mandalRef}
              placeholder="Mandal"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">5.5</span> Pin Code
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={pincodeRef}
              placeholder="Pin Code"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        {/*--------------------- section 5 end here ------------------------- */}

        {/*--------------------- section 6 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            6. Permanent Address
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">6.1</span> Applicant village
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <select
              ref={pvillageRef}
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

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">6.2</span> Address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={paddressRef}
              placeholder="Address"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            ></textarea>
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">6.3</span> District
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={pdistrictRef}
              placeholder="District"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">6.4</span> Mandal
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={pmandalRef}
              placeholder="Mandal"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">6.5</span> Pin Code
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={ppincodeRef}
              placeholder="Pin Code"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        {/*--------------------- section 6 end here ------------------------- */}

        {/*--------------------- section 7 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            7. Informant Details
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">7.1</span> Informant Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={informantnameRef}
              placeholder="Informant Name"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">7.2</span> Informant Relation
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={informantrelationRef}
              placeholder="Informant Relation"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">7.3</span> Delivery Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={deliverytypeRef}
              placeholder="Delivery Type"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">7.4</span> Mobile No
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={mobilenoRef}
              placeholder="Mobile No"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>

        {/*--------------------- section 7 end here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            8. Attachment(s)
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">8.1</span> Applicant UIDAI Aadhaar Upload
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
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">8.2</span> Gas Connection Proof
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={gas_connection_url_Ref}
                onChange={(e) => handleLogoChange(e, setGas_connection_url)}
              />
            </div>
            <button
              onClick={() => gas_connection_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {gas_connection_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {gas_connection_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(gas_connection_url)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">8.3</span> Residence Proof
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={resident_proof_url_Ref}
                onChange={(e) => handleLogoChange(e, setResident_proof_url)}
              />
            </div>
            <button
              onClick={() => resident_proof_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {resident_proof_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {resident_proof_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(resident_proof_url)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">8.4</span> Applicant Photo
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={photo_url_Ref}
                onChange={(e) => handleLogoChange(e, setPhoto_url)}
              />
            </div>
            <button
              onClick={() => photo_url_Ref.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {photo_url == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {photo_url != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(photo_url)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                rel="noreferrer"
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
            9. Applicant / Occupant Declaration and Signature{" "}
          </p>
        </div>

        <div className="flex gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="text-xl font-normal text-left text-gray-700 ">
            9.1
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
            <span className="mr-2">9.2</span> Applicant Signature Image Upload
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
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
        </div>

        {/*--------------------- section 5 end here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            Add Member
          </p>
        </div>

        <div className="container mx-auto my-5">
          <h2 className="text-2xl font-bold mb-5">Add New Member</h2>

          {/* Name */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.1</span> Applicant Name
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                ref={mnameRef}
                placeholder="Applicant Name"
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>

          {/* Mother Name */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.2</span> Applicant Mother Name
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                ref={mmotherRef}
                placeholder="Applicant Mother Name"
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>

          {/* Father Name */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.3</span> Applicant Father Name
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                ref={mfatherRef}
                placeholder="Applicant Father Name"
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>

          {/* Spouse Name */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.4</span> Applicant Spouse Name
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                ref={mspouseRef}
                placeholder="Applicant Spouse Name"
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.7</span> Date of Birth
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                type="date"
                ref={mdateOfBirthRef}
                max={new Date().toISOString().split("T")[0]}
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.6</span> Gender
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
              {Gender.map((val: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={() => setMGender(val)}
                >
                  <input
                    type="checkbox"
                    checked={val === mgender}
                    className="accent-blue-500 scale-125"
                  />
                  <p className="text-md text-black font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Option to Life Commodity */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.8</span> Option to Life Commodity
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto flex gap-6 items-center">
              {/* Yes Option */}
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => setOption_to_life_commodity(true)}
              >
                <input
                  type="radio"
                  name="option_to_life_commodity"
                  checked={option_to_life_commodityRef === true}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">Yes</p>
              </div>

              {/* No Option */}
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => setOption_to_life_commodity(false)}
              >
                <input
                  type="radio"
                  name="option_to_life_commodity"
                  checked={option_to_life_commodityRef === false}
                  className="accent-blue-500 scale-125"
                />
                <p className="text-md text-black font-medium">No</p>
              </div>
            </div>
          </div>
          {/* UID */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.9</span> Applicant UID
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                ref={muidRef}
                placeholder="UID"
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>

          {/* EID */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.10</span> Applicant EID
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                ref={meidRef}
                placeholder="EID"
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>

          {/* Age */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.11</span> Applicant Age
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                ref={mageRef}
                placeholder="Age"
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>

          {/* Relationship with Head of Family */}
          <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">2.12</span> Relationship with Head of
              Family
            </div>
            <div className="flex-none lg:flex-1 w-full lg:w-auto">
              <input
                ref={relationshipwithheadRef}
                placeholder="Relationship with Head"
                className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              />
            </div>
          </div>
          <div className="flex justify-end px-4 py-2">
            <button
              onClick={addMember}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Member
            </button>
          </div>
        </div>

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            Member List
          </p>
        </div>

        <div className="container mx-auto my-5">
          {member.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-left">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Gender</th>
                  <th className="py-2 px-4 border">Date of Birth</th>
                  <th className="py-2 px-4 border">Mother's Name</th>
                  <th className="py-2 px-4 border">Father's Name</th>
                  <th className="py-2 px-4 border">Spouse Name</th>
                  <th className="py-2 px-4 border">UID</th>
                  <th className="py-2 px-4 border">EID</th>
                  <th className="py-2 px-4 border">Age</th>
                  <th className="py-2 px-4 border">Option to Life Commodity</th>
                  <th className="py-2 px-4 border">Relationship with Head</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {member.map((m, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">{m.name}</td>
                    <td className="py-2 px-4 border">{m.gender}</td>
                    <td className="py-2 px-4 border">
                      {m.date_of_birth.toDateString()}
                    </td>
                    <td className="py-2 px-4 border">{m.mother_name}</td>
                    <td className="py-2 px-4 border">{m.father_name}</td>
                    <td className="py-2 px-4 border">
                      {m.spouse_name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">{m.uid}</td>
                    <td className="py-2 px-4 border">{m.eid}</td>
                    <td className="py-2 px-4 border">{m.age}</td>
                    <td className="py-2 px-4 border">
                      {m.option_to_life_commodity ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border">
                      {m.relationship_with_head_of_family}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                        onClick={() => removeMember(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No members available</p>
          )}
        </div>

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

export default NewRationCard;
