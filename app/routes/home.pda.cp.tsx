import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall, UploadFile } from "~/services/api";
import { z } from "zod";
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
            id: parseInt(cookie.id!)
        },
    });
    return json({ user: userdata.data.getUserById });
};

const CP: React.FC = (): JSX.Element => {
    const user = useLoaderData().user;
    const nameRef = useRef<HTMLInputElement>(null);
    const mobileRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const uidRef = useRef<HTMLInputElement>(null);


    const villageRef = useRef<HTMLSelectElement>(null);
    const [village, setVillage] = useState<any[]>([]);

    const surveyRef = useRef<HTMLSelectElement>(null);
    const [survey, setSurvey] = useState<any[]>([]);

    const divisionRef = useRef<HTMLSelectElement>(null);
    const [subdivision, setSubdivision] = useState<any[]>([]);

    interface landDetailsType {
        land: string | null;
        area: string | null;
    }
    const [landDetails, setLandDetails] = useState<landDetailsType>({ area: null, land: null });



    const architect_nameRef = useRef<HTMLInputElement>(null);
    const architect_licenseRef = useRef<HTMLInputElement>(null);
    const valid_uptoRef = useRef<HTMLInputElement>(null);

    const applicant_uidRef = useRef<HTMLInputElement>(null);
    const [applicant_uid, setApplicant_uid] = useState<File>();

    const annexure_twoRef = useRef<HTMLInputElement>(null);
    const [annexure_two, setAnnexure_two] = useState<File>();

    const annexure_threeRef = useRef<HTMLInputElement>(null);
    const [annexure_three, setAnnexure_three] = useState<File>();

    const annexure_fourRef = useRef<HTMLInputElement>(null);
    const [annexure_four, setAnnexure_four] = useState<File>();

    const annexure_fiveRef = useRef<HTMLInputElement>(null);
    const [annexure_five, setAnnexure_five] = useState<File>();

    const na_copoyRef = useRef<HTMLInputElement>(null);
    const [na_copoy, setNa_copoy] = useState<File>();

    const map_copyRef = useRef<HTMLInputElement>(null);
    const [map_copy, setmap_copy] = useState<File>();

    const nakal_1_14Ref = useRef<HTMLInputElement>(null);
    const [nakal_1_14, setNakal_1_14] = useState<File>();

    const building_planRef = useRef<HTMLInputElement>(null);
    const [building_plan, setBuilding_plan] = useState<File>();

    const scrutiny_feesRef = useRef<HTMLInputElement>(null);
    const [scrutiny_fees, setScrutiny_fees] = useState<File>();

    const coast_guard_nocRef = useRef<HTMLInputElement>(null);
    const [coast_guard_noc, setCoast_guard_noc] = useState<File>();

    const fire_nocRef = useRef<HTMLInputElement>(null);
    const [fire_noc, setFire_noc] = useState<File>();

    const crz_nocRef = useRef<HTMLInputElement>(null);
    const [crz_noc, setCrz_noc] = useState<File>();

    const layout_planRef = useRef<HTMLInputElement>(null);
    const [layout_plan, setLayout_plan] = useState<File>();

    const revised_planRef = useRef<HTMLInputElement>(null);
    const [revised_plan, setRevised_plan] = useState<File>();

    const fsiRef = useRef<HTMLInputElement>(null);
    const [fsi, setFsi] = useState<File>();



    const [isChecked, setIsChecked] = useState(false);
    const sigimgRef = useRef<HTMLInputElement>(null);
    const [sigimg, setSigimg] = useState<File>();

    const navigator = useNavigate();

    const getSurveyNumber = async () => {
        if (villageRef!.current!.value == "0") {
            toast.error("Select Village first.", { theme: "light" });
        }
        const survey = await ApiCall({
            query: `
            query getSurveyNumber($searchSurveyInput:SearchSurveyInput!){
                getSurveyNumber(searchSurveyInput:$searchSurveyInput){
                  survey_no
                }
              }
          `,
            veriables: {
                searchSurveyInput: {
                    villageId: parseInt(villageRef!.current!.value)
                }
            },
        });
        if (survey.status) {
            setSurvey((val) => survey.data.getSurveyNumber);
        } else {
            toast.error("No Survey Number exist on this village.", { theme: "light" });
        }
    };

    const getSubDivision = async () => {
        if (surveyRef!.current!.value == "0") {
            toast.error("Select survey Number first.", { theme: "light" });
        }
        const subdivision = await ApiCall({
            query: `
            query getSubDivision($searchSurveyInput:SearchSurveyInput!){
                getSubDivision(searchSurveyInput:$searchSurveyInput){
                  sub_division,
                  owner_name,
                  area
                }
              }
          `,
            veriables: {
                searchSurveyInput: {
                    villageId: parseInt(villageRef!.current!.value),
                    survey_no: surveyRef!.current!.value,
                }
            },
        });

        if (subdivision.status) {
            setSubdivision((val) => subdivision.data.getSubDivision);
        } else {
            toast.error("No sub division exist on this Survey Number.", { theme: "light" });
        }
    };


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
            veriables: {}
        });
        if (village.status) {
            setVillage((val) => village.data.getAllVillage);
        }
    }
    useEffect(() => {
        getVillage();
        nameRef!.current!.value = user.name ?? "";
        mobileRef!.current!.value = user.contact ?? "";
        emailRef!.current!.value = user.email ?? "";
        addressRef!.current!.value = user.address ?? "";
        uidRef!.current!.value = user.user_uid ?? "";
    }, []);

    const setlanddetails = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSubdivision = subdivision.find((val) => val.sub_division === e.target.value);
        if (selectedSubdivision) {
            setLandDetails(val => ({ land: selectedSubdivision.owner_name, area: selectedSubdivision.area }));
            nameRef!.current!.value = `${selectedSubdivision.owner_name.toString().split(",")[0]} ${selectedSubdivision.owner_name.toString().includes(",") ? " and others" : ""}`;
        }
    };


    const handleLogoChange = (value: React.ChangeEvent<HTMLInputElement>, setvalue: Function) => {
        let file_size = parseInt(
            (value!.target.files![0].size / 1024 / 1024).toString()
        );
        if (file_size < 4) {
            setvalue((val: any) => value!.target.files![0]);
        } else {
            toast.error("Image file size must be less then 4 mb", { theme: "light" });
        }
    }

    const submit = async () => {
        const CpScheme = z
            .object({
                name: z
                    .string()
                    .nonempty("Applicant Name is required."),
                address: z
                    .string()
                    .nonempty("Applicant address is required."),
                mobile: z
                    .string()
                    .nonempty("Applicant Contact Number is required.")
                    .length(10, "Mobile Number shoule be 10 digit."),
                email: z
                    .string()
                    .email("Enter a valid email.")
                    .optional(),
                user_uid: z
                    .string()
                    .refine(value => checkUID(value), {
                        message: "Invalid UIDAI Number",
                    })
                    .optional(),
                village_id: z
                    .number({ invalid_type_error: "Select a valid village", required_error: "Select a village" })
                    .refine((val) => val != 0, {
                        message: "Please select village",
                      }),
                survey_no: z
                    .string()
                    .nonempty("Select survey numbers."),
                sub_division: z
                    .string()
                    .nonempty("Select sub division."),
                permission_date: z
                    .date({ required_error: "Enter Permission  date", invalid_type_error: "Enter a valid Permission  date" })
                    .optional(),
                permission_number: z
                    .string()
                    .optional(),
                architect_name: z
                    .string()
                    .nonempty("Enter a valid Architect Name."),
                architect_license: z
                    .string()
                    .nonempty("Architect license numberd is required."),
                valid_upto: z
                    .date({ required_error: "Enter Architect license valid  date", invalid_type_error: "Enter a valid Architect license valid date" })
                    .optional(),
                completion_date: z
                    .date({ required_error: "Enter Completion  date", invalid_type_error: "Enter a valid Completion  date" })
                    .optional(),
                iagree: z
                    .string()
                    .nonempty("Check the  agree box"),
            })
            .strict();

        type CpScheme = z.infer<typeof CpScheme>;

        const cpScheme: CpScheme = {
            name: nameRef!.current!.value,
            address: addressRef!.current!.value,
            mobile: mobileRef!.current!.value,
            email: emailRef!.current!.value,
            user_uid: uidRef!.current!.value,
            village_id: parseInt(villageRef!.current!.value),
            survey_no: surveyRef!.current!.value,
            architect_name: architect_nameRef!.current!.value,
            architect_license: architect_licenseRef!.current!.value,
            valid_upto: new Date(valid_uptoRef!.current!.value),
            sub_division: divisionRef!.current!.value,
            iagree: isChecked ? "YES" : "NO",
        };

        const parsed = CpScheme.safeParse(cpScheme);

        if (parsed.success) {
            if (applicant_uid == null || applicant_uid == undefined) { toast.error("Upload Applicant Document.", { theme: "light" }); }
            if (annexure_two == null || annexure_two == undefined) { toast.error("Upload Annexure 2.", { theme: "light" }); }
            if (annexure_three == null || annexure_three == undefined) { toast.error("Upload Annexure 3.", { theme: "light" }); }
            if (annexure_four == null || annexure_four == undefined) { toast.error("Upload Annexure 4.", { theme: "light" }); }
            if (annexure_five == null || annexure_five == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (na_copoy == null || na_copoy == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (map_copy == null || map_copy == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (nakal_1_14 == null || nakal_1_14 == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (building_plan == null || building_plan == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (scrutiny_fees == null || scrutiny_fees == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (coast_guard_noc == null || coast_guard_noc == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (fire_noc == null || fire_noc == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (crz_noc == null || crz_noc == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (layout_plan == null || layout_plan == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (revised_plan == null || revised_plan == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (fsi == null || fsi == undefined) { toast.error("Upload Annexure 5.", { theme: "light" }); }
            if (sigimg == null || sigimg == undefined) { toast.error("Select Signature Image.", { theme: "light" }); }

            const applicant_uid_url = await UploadFile(applicant_uid!);
            const annexure_two_url = await UploadFile(annexure_two!);
            const annexure_three_url = await UploadFile(annexure_three!);
            const annexure_four_url = await UploadFile(annexure_four!);
            const annexure_five_url = await UploadFile(annexure_five!);
            const na_copoy_url = await UploadFile(na_copoy!);
            const map_copy_url = await UploadFile(map_copy!);
            const nakal_1_14_url = await UploadFile(nakal_1_14!);
            const building_plan_url = await UploadFile(building_plan!);
            const scrutiny_fees_url = await UploadFile(scrutiny_fees!);
            const coast_guard_noc_url = await UploadFile(coast_guard_noc!);
            const fire_noc_url = await UploadFile(fire_noc!);
            const crz_noc_url = await UploadFile(crz_noc!);
            const layout_plan_url = await UploadFile(layout_plan!);
            const revised_plan_url = await UploadFile(revised_plan!);
            const fsi_url = await UploadFile(fsi!);
            const sign_url = await UploadFile(sigimg!);

            if (
                applicant_uid_url.status &&
                annexure_two_url &&
                annexure_three_url &&
                annexure_four_url &&
                annexure_five_url &&
                na_copoy_url &&
                map_copy_url &&
                nakal_1_14_url &&
                building_plan_url &&
                scrutiny_fees_url &&
                coast_guard_noc_url &&
                fire_noc_url &&
                crz_noc_url &&
                fire_noc_url &&
                layout_plan_url &&
                revised_plan_url &&
                fsi_url &&
                sign_url.status
            ) {

                const data = await ApiCall({
                    query: `
                    mutation createCp($createCpInput:CreateCpInput!){
                        createCp(createCpInput:$createCpInput){
                          id
                        }
                      }
                    `,
                    veriables: {
                        createCpInput: {
                            userId: Number(user.id),
                            name: cpScheme.name,
                            address: cpScheme.address,
                            email: cpScheme.email,
                            mobile: cpScheme.mobile,
                            user_uid: cpScheme.user_uid,
                            permission_date: cpScheme.permission_date,
                            permission_number: cpScheme.permission_number,
                            architect_name: cpScheme.architect_name,
                            architect_license: cpScheme.architect_license,
                            valid_upto: cpScheme.valid_upto,
                            completion_date: cpScheme.completion_date,
                            village_id: cpScheme.village_id,
                            survey_no: cpScheme.survey_no,
                            sub_division: cpScheme.sub_division,
                            applicant_uid: applicant_uid_url.data,
                            annexure_two: annexure_two_url.data,
                            annexure_three: annexure_three_url.data,
                            annexure_four: annexure_four_url.data,
                            annexure_five: annexure_five_url.data,
                            na_copoy: na_copoy_url.data,
                            map_copy: map_copy_url.data,
                            nakal_1_14: nakal_1_14_url.data,
                            building_plan: building_plan_url.data,
                            scrutiny_fees: scrutiny_fees_url.data,
                            coast_guard_noc: coast_guard_noc_url.data,
                            fire_noc: fire_noc_url.data,
                            crz_noc: crz_noc_url.data,
                            layout_plan: layout_plan_url.data,
                            revised_plan: revised_plan_url.data,
                            fsi: fsi_url.data,
                            signature_url: sign_url.data,
                            iagree: cpScheme.iagree,
                            status: "ACTIVE",
                        }
                    },
                });
                if (!data.status) {
                    toast.error(data.message, { theme: "light" });
                } else {
                    navigator(`/home/pda/cpview/${data.data.createCp.id}`);
                }
            }
            else {
                toast.error("Something went wrong unable to upload images.", { theme: "light" });
            }
        } else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }

    }

    const handleNumberChange = () => {
        if (mobileRef.current) {
            const numericValue = mobileRef.current.value.replace(/[^0-9]/g, '');
            if (numericValue.toString().length <= 10) {
                mobileRef.current.value = numericValue;
            }
        }
    };

    return (
        <>
            <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Construction Permisstion</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <p className="text-center font-semibold text-xl text-gray-800"> SUBJECT  :  Respected Sir / Madam,
                    I hereby apply for construction permisstion for which details are given below :-</p>

                {/*--------------------- section 1 start here ------------------------- */}
                <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white">1. Land Details </p>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">1.1</span> Applicant village
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select ref={villageRef} onChange={getSurveyNumber} defaultValue={"0"} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select village</option>
                            {village.map((val: any, index: number) =>
                                <option key={index} value={val.id} className="bg-white text-black text-lg" >{val.name}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.2</span> Survey No
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select disabled={villageRef.current?.value == "0" ? true : false} ref={surveyRef} defaultValue={"0"} onChange={getSubDivision} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select Survey No</option>
                            {survey.map((val: any, index: number) =>
                                <option key={index} value={val.survey_no} className="bg-white text-black text-lg">{val.survey_no}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.3</span> Sub Division
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select disabled={surveyRef.current?.value == "0"} ref={divisionRef} defaultValue={"0"} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setlanddetails(e)} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select Sub Division</option>
                            {subdivision.map((val: any, index: number) =>
                                <option key={index} value={val.sub_division} className="bg-white text-black text-lg">{val.sub_division}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.4</span> Land Owner
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {landDetails.land == null || landDetails.land == undefined || landDetails.land == "" ? "-" : landDetails.land}
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">1.5</span> Area
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
                        {landDetails.area == null || landDetails.area == undefined || landDetails.area == "" ? "-" : landDetails.area}
                    </div>
                </div>



                {/*--------------------- section 1 end here ------------------------- */}

                {/*--------------------- section 2 start here ------------------------- */}
                <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 2. Applicant Details(s) </p>
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
                            maxLength={10}
                            placeholder="Applicant Contact Number"
                            onChange={handleNumberChange}
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.4</span> Applicant E-mail
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
                    <p className="text-left font-semibold text-xl text-white"> 3. Architect Details </p>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.1</span> Architect Name
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={architect_nameRef}
                            placeholder="Architect Name"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>

                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.2</span> Architect License Number
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={architect_licenseRef}
                            placeholder="Architect License Number"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.3</span> Architect License Valid Upto
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            type="date"
                            ref={valid_uptoRef}
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                {/*--------------------- section 3 end here ------------------------- */}

                {/*--------------------- section 4 start here ------------------------- */}
                <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 4. Document Attachment </p>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.1</span> Upload Applicant UID
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={applicant_uidRef} accept="*/*" onChange={(e) => handleLogoChange(e, setApplicant_uid)} />
                        </div>
                        <button
                            onClick={() => applicant_uidRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {applicant_uid == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            applicant_uid != null ?
                                <a target="_blank" href={URL.createObjectURL(applicant_uid)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.2</span> Upload Annexure II
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={annexure_twoRef} accept="*/*" onChange={(e) => handleLogoChange(e, setAnnexure_two)} />
                        </div>
                        <button
                            onClick={() => annexure_twoRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {annexure_two == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            annexure_two != null ?
                                <a target="_blank" href={URL.createObjectURL(annexure_two)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.3</span> Upload Annexure III
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={annexure_threeRef} accept="*/*" onChange={(e) => handleLogoChange(e, setAnnexure_three)} />
                        </div>
                        <button
                            onClick={() => annexure_threeRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {annexure_three == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            annexure_three != null ?
                                <a target="_blank" href={URL.createObjectURL(annexure_three)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.4</span> Upload Annexure IV
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={annexure_fourRef} accept="*/*" onChange={(e) => handleLogoChange(e, setAnnexure_four)} />
                        </div>
                        <button
                            onClick={() => annexure_fourRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {annexure_four == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            annexure_four != null ?
                                <a target="_blank" href={URL.createObjectURL(annexure_four)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.5</span> Upload Annexure V (Required if the building is High Rise Building)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={annexure_fiveRef} accept="*/*" onChange={(e) => handleLogoChange(e, setAnnexure_five)} />
                        </div>
                        <button
                            onClick={() => annexure_fiveRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {annexure_five == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            annexure_five != null ?
                                <a target="_blank" href={URL.createObjectURL(annexure_five)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.6</span> Upload Copy of N.A. Sanad /Order/ Property card for existing Gaothan area. (Mandatory)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={na_copoyRef} accept="*/*" onChange={(e) => handleLogoChange(e, setNa_copoy)} />
                        </div>
                        <button
                            onClick={() => na_copoyRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {na_copoy == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            na_copoy != null ?
                                <a target="_blank" href={URL.createObjectURL(na_copoy)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.7</span> Upload Original certified Map of Survey/Plot no. issued by City Survey office, Daman (latest original) (Mandatory)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={map_copyRef} accept="*/*" onChange={(e) => handleLogoChange(e, setmap_copy)} />
                        </div>
                        <button
                            onClick={() => map_copyRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {map_copy == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            map_copy != null ?
                                <a target="_blank" href={URL.createObjectURL(map_copy)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.8</span>Upload I and XIV nakal (Latest original) (Mandatory)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={nakal_1_14Ref} accept="*/*" onChange={(e) => handleLogoChange(e, setNakal_1_14)} />
                        </div>
                        <button
                            onClick={() => nakal_1_14Ref.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {nakal_1_14 == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            nakal_1_14 != null ?
                                <a target="_blank" href={URL.createObjectURL(nakal_1_14)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.9</span>Upload Building Plan with complete details as per Rule 6.7 to 6.12 of DCR 2005 (Building plan shall also include Key Plan/Location plan, site plan and service plan.) (Mandatory)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={building_planRef} accept="*/*" onChange={(e) => handleLogoChange(e, setBuilding_plan)} />
                        </div>
                        <button
                            onClick={() => building_planRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {building_plan == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            building_plan != null ?
                                <a target="_blank" href={URL.createObjectURL(building_plan)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.10</span> Upload Scrutiny fees (By ATM card or by cheque) (mandatory – to be submitted at the time of application)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={scrutiny_feesRef} accept="*/*" onChange={(e) => handleLogoChange(e, setScrutiny_fees)} />
                        </div>
                        <button
                            onClick={() => scrutiny_feesRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {scrutiny_fees == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            scrutiny_fees != null ?
                                <a target="_blank" href={URL.createObjectURL(scrutiny_fees)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.11</span> Upload NOC of the coast Guard Authority for Height Restriction/ Receive copy of application made for issuance of NOC to Coast Guard Authority (Mandatory).
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={coast_guard_nocRef} accept="*/*" onChange={(e) => handleLogoChange(e, setCoast_guard_noc)} />
                        </div>
                        <button
                            onClick={() => coast_guard_nocRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {coast_guard_noc == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            coast_guard_noc != null ?
                                <a target="_blank" href={URL.createObjectURL(coast_guard_noc)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.12</span> Upload Provisional NOC from Fire Department (Applicable to all building except Residential building having height less than 15m)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={fire_nocRef} accept="*/*" onChange={(e) => handleLogoChange(e, setFire_noc)} />
                        </div>
                        <button
                            onClick={() => fire_nocRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {fire_noc == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            fire_noc != null ?
                                <a target="_blank" href={URL.createObjectURL(fire_noc)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.13</span> Upload CRZ clearance certificate of the concerned authority (This is required in case of land falling under CRZ)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={crz_nocRef} accept="*/*" onChange={(e) => handleLogoChange(e, setCrz_noc)} />
                        </div>
                        <button
                            onClick={() => crz_nocRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {crz_noc == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            crz_noc != null ?
                                <a target="_blank" href={URL.createObjectURL(crz_noc)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.14</span> Upload True copy of approved layout plan and Sub division order (This is applicable if land is part of private Industrial Estate/ Private sub division.)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={layout_planRef} accept="*/*" onChange={(e) => handleLogoChange(e, setLayout_plan)} />
                        </div>
                        <button
                            onClick={() => layout_planRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {layout_plan == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            layout_plan != null ?
                                <a target="_blank" href={URL.createObjectURL(layout_plan)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.15</span> Upload If application is for revised plan/additional and alteration to the existing building, then true copy of the construction permission along with approved plan and Occupancy Certificate is required.
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={revised_planRef} accept="*/*" onChange={(e) => handleLogoChange(e, setRevised_plan)} />
                        </div>
                        <button
                            onClick={() => revised_planRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {revised_plan == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            revised_plan != null ?
                                <a target="_blank" href={URL.createObjectURL(revised_plan)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.16</span> Upload .Certificate or order of the Land Acquisition Officer if claiming the benefit of additional FSI in lieu of compensation (If applicable)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={fsiRef} accept="*/*" onChange={(e) => handleLogoChange(e, setFsi)} />
                        </div>
                        <button
                            onClick={() => fsiRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {fsi == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            fsi != null ?
                                <a target="_blank" href={URL.createObjectURL(fsi)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>


                {/*--------------------- section 4 end here ------------------------- */}


                {/*--------------------- section 5 start here ------------------------- */}
                <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white">
                        5. Applicant / Occupant Declaration and Signature </p>
                </div>

                <div className="flex gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="text-xl font-normal text-left text-gray-700 ">
                        5.1
                    </div>
                    <div className="flex items-start">
                        <input type="checkbox" className="mr-2 my-2" checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)} />
                        <label htmlFor="checkbox" className="text-xl font-normal text-left text-gray-700 ">
                            I solemnly affirm & hereby give undertaking that the above information furnished by me are correct and true to the best of my knowledge and belief
                        </label>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">5.2</span> Applicant Signature Image
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={sigimgRef} accept="*/*" onChange={(e) => handleLogoChange(e, setSigimg)} />
                        </div>
                        <button
                            onClick={() => sigimgRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {sigimg == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            sigimg != null ?
                                <a target="_blank" href={URL.createObjectURL(sigimg)}
                                    className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium">
                                    <Fa6SolidFileLines></Fa6SolidFileLines>
                                    <p>
                                        View Doc.
                                    </p>
                                </a>
                                : null
                        }
                    </div>
                </div>
                {/*--------------------- section 5 end here ------------------------- */}
                <div className="flex flex-wrap gap-6 mt-4">
                    <Link to={"/home/"}
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
}

export default CP;