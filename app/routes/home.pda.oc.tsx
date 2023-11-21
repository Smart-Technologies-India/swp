import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall, UploadFile } from "~/services/api";
import { z } from "zod";


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
            id: parseInt(cookie.id!)
        },
    });
    return json({ user: userdata.data.getUserById });
};

const Oc: React.FC = (): JSX.Element => {
    const user = useLoaderData().user;
    const nameRef = useRef<HTMLInputElement>(null);
    const mobileRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    // const uidRef = useRef<HTMLInputElement>(null);
    const permission_numberRef = useRef<HTMLInputElement>(null);
    const permission_dateRef = useRef<HTMLInputElement>(null);


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
    const completion_dateRef = useRef<HTMLInputElement>(null);

    const applicant_uidRef = useRef<HTMLInputElement>(null);
    const [applicant_uid, setApplicant_uid] = useState<File>();

    const completion_certificateRef = useRef<HTMLInputElement>(null);
    const [completion_certificate, setCompletion_certificate] = useState<File>();

    const construction_permissionRef = useRef<HTMLInputElement>(null);
    const [construction_permission, setConstruction_permission] = useState<File>();

    const building_planRef = useRef<HTMLInputElement>(null);
    const [building_plan, setBuilding_plan] = useState<File>();

    const annexure_fourteenRef = useRef<HTMLInputElement>(null);
    const [annexure_fourteen, setAnnexure_fourteen] = useState<File>();

    const coast_guard_nocRef = useRef<HTMLInputElement>(null);
    const [coast_guard_noc, setCoast_guard_noc] = useState<File>();

    const fire_nocRef = useRef<HTMLInputElement>(null);
    const [fire_noc, setFire_noc] = useState<File>();

    const rainwater_harvestRef = useRef<HTMLInputElement>(null);
    const [rainwater_harvest, setRainwater_harvest] = useState<File>();

    const deviation_planRef = useRef<HTMLInputElement>(null);
    const [deviation_plan, setDeviation_plan] = useState<File>();

    const indemnityRef = useRef<HTMLInputElement>(null);
    const [indemnity, setIndemnity] = useState<File>();

    const valuation_certificateRef = useRef<HTMLInputElement>(null);
    const [valuation_certificate, setValuation_certificate] = useState<File>();

    const labour_cessRef = useRef<HTMLInputElement>(null);
    const [labour_cess, setLabour_cess] = useState<File>();



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
        // uidRef!.current!.value = user.user_uid ?? "";
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
        const OcScheme = z
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

        type OcScheme = z.infer<typeof OcScheme>;

        const ocScheme: OcScheme = {
            name: nameRef!.current!.value,
            address: addressRef!.current!.value,
            mobile: mobileRef!.current!.value,
            email: emailRef!.current!.value,
            user_uid: user.user_uid_four,
            village_id: parseInt(villageRef!.current!.value),
            survey_no: surveyRef!.current!.value,
            permission_date: new Date(permission_dateRef!.current!.value),
            permission_number: permission_numberRef!.current!.value,
            architect_name: architect_nameRef!.current!.value,
            architect_license: architect_licenseRef!.current!.value,
            valid_upto: new Date(valid_uptoRef!.current!.value),
            completion_date: new Date(completion_dateRef!.current!.value),
            sub_division: divisionRef!.current!.value,
            iagree: isChecked ? "YES" : "NO",
        };

        const parsed = OcScheme.safeParse(ocScheme);

        if (parsed.success) {
            if (applicant_uid == null || applicant_uid == undefined) { toast.error("Upload Applicant Document.", { theme: "light" }); }
            if (completion_certificate == null || completion_certificate == undefined) { toast.error("Upload Completion Certificate Document.", { theme: "light" }); }
            if (construction_permission == null || construction_permission == undefined) { toast.error("Upload Construction Permission Document.", { theme: "light" }); }
            if (building_plan == null || building_plan == undefined) { toast.error("Upload Building Plan Document.", { theme: "light" }); }
            if (annexure_fourteen == null || annexure_fourteen == undefined) { toast.error("Upload Annexure 14 Document.", { theme: "light" }); }
            if (coast_guard_noc == null || coast_guard_noc == undefined) { toast.error("Upload Coast Guard NOC Document.", { theme: "light" }); }
            if (fire_noc == null || fire_noc == undefined) { toast.error("Upload Fire NOC Document.", { theme: "light" }); }
            if (rainwater_harvest == null || rainwater_harvest == undefined) { toast.error("Upload Rainwater Harvest Document.", { theme: "light" }); }
            if (deviation_plan == null || deviation_plan == undefined) { toast.error("Upload Deviation Plan Document.", { theme: "light" }); }
            if (indemnity == null || indemnity == undefined) { toast.error("Upload Indemnity Document.", { theme: "light" }); }
            if (valuation_certificate == null || valuation_certificate == undefined) { toast.error("Upload Valuation Certificate Document.", { theme: "light" }); }
            if (labour_cess == null || labour_cess == undefined) { toast.error("Upload Labour Cess Document.", { theme: "light" }); }
            if (sigimg == null || sigimg == undefined) { toast.error("Select Signature Image.", { theme: "light" }); }

            const applicant_uid_url = await UploadFile(applicant_uid!);
            const completion_certificate_url = await UploadFile(completion_certificate!);
            const construction_permission_url = await UploadFile(construction_permission!);
            const building_plan_url = await UploadFile(building_plan!);
            const annexure_fourteen_url = await UploadFile(annexure_fourteen!);
            const coast_guard_noc_url = await UploadFile(coast_guard_noc!);
            const fire_noc_url = await UploadFile(fire_noc!);
            const rainwater_harvest_url = await UploadFile(rainwater_harvest!);
            const deviation_plan_url = await UploadFile(deviation_plan!);
            const indemnity_url = await UploadFile(indemnity!);
            const valuation_certificaten_url = await UploadFile(valuation_certificate!);
            const labour_cess_url = await UploadFile(labour_cess!);
            const sign_url = await UploadFile(sigimg!);



            if (applicant_uid_url.status && completion_certificate_url && construction_permission_url && building_plan_url && annexure_fourteen_url && coast_guard_noc_url && fire_noc_url && rainwater_harvest_url && deviation_plan_url && indemnity_url && valuation_certificaten_url && labour_cess_url && sign_url.status) {

                const data = await ApiCall({
                    query: `
                    mutation createOc($createOcInput:CreateOcInput!){
                        createOc(createOcInput:$createOcInput){
                          id
                        }
                      }
                    `,
                    veriables: {
                        createOcInput: {
                            userId: Number(user.id),
                            name: ocScheme.name,
                            address: ocScheme.address,
                            email: ocScheme.email,
                            mobile: ocScheme.mobile,
                            user_uid: ocScheme.user_uid,
                            permission_date: ocScheme.permission_date,
                            permission_number: ocScheme.permission_number,
                            architect_name: ocScheme.architect_name,
                            architect_license: ocScheme.architect_license,
                            valid_upto: ocScheme.valid_upto,
                            completion_date: ocScheme.completion_date,
                            village_id: ocScheme.village_id,
                            survey_no: ocScheme.survey_no,
                            sub_division: ocScheme.sub_division,
                            applicant_uid: applicant_uid_url.data,
                            completion_certificate: completion_certificate_url.data,
                            construction_permission: construction_permission_url.data,
                            building_plan: building_plan_url.data,
                            annexure_fourteen: annexure_fourteen_url.data,
                            coast_guard_noc: coast_guard_noc_url.data,
                            fire_noc: fire_noc_url.data,
                            rainwater_harvest: rainwater_harvest_url.data,
                            deviation_plan: deviation_plan_url.data,
                            indemnity: indemnity_url.data,
                            valuation_certificate: valuation_certificaten_url.data,
                            labour_cess: labour_cess_url.data,
                            signature_url: sign_url.data,
                            iagree: ocScheme.iagree,
                            status: "ACTIVE",
                        }
                    },
                });
                if (!data.status) {
                    toast.error(data.message, { theme: "light" });
                } else {
                    navigator(`/home/pda/ocview/${data.data.createOc.id}`);
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
                <h1 className="text-gray-800 text-3xl font-semibold text-center">Occupancy Certificate / Part Occupancy Certificate</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <p className="text-center font-semibold text-xl text-gray-800"> SUBJECT  :  Respected Sir / Madam,
                    I hereby apply for Occupancy Certificate for which details are given below :-</p>


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
                    <div className="w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2">
              {" "}
              XXXX-XXXX-{user.user_uid_four.toString()}
            </div>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.6</span> Permission Number
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={permission_numberRef}
                            placeholder="Permission number"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.7</span> Permission Date
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            type="date"
                            ref={permission_dateRef}
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
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.4</span> Completion Date
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            type="date"
                            ref={completion_dateRef}
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
                        <span className="mr-2">4.1</span> Aadhar Card and Land Documents
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
                        <span className="mr-2">4.2</span> Application form of Completion Certificate for Issue of Occupancy/Part Occupancy Certificate as per Annexure-13
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={completion_certificateRef} accept="*/*" onChange={(e) => handleLogoChange(e, setCompletion_certificate)} />
                        </div>
                        <button
                            onClick={() => completion_certificateRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {completion_certificate == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            completion_certificate != null ?
                                <a target="_blank" href={URL.createObjectURL(completion_certificate)}
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
                        <span className="mr-2">4.3</span> True copy of Construction permission order
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={construction_permissionRef} accept="*/*" onChange={(e) => handleLogoChange(e, setConstruction_permission)} />
                        </div>
                        <button
                            onClick={() => construction_permissionRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {construction_permission == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            construction_permission != null ?
                                <a target="_blank" href={URL.createObjectURL(construction_permission)}
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
                        <span className="mr-2">4.4</span> Approved Building Plan
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
                        <span className="mr-2">4.5</span> Annexure -14. (Applicable for High Rise Building Only).
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={annexure_fourteenRef} accept="*/*" onChange={(e) => handleLogoChange(e, setAnnexure_fourteen)} />
                        </div>
                        <button
                            onClick={() => annexure_fourteenRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {annexure_fourteen == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            annexure_fourteen != null ?
                                <a target="_blank" href={URL.createObjectURL(annexure_fourteen)}
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
                        <span className="mr-2">4.6</span> Final NOC from Coast Guard Authority for building height.
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
                        <span className="mr-2">4.7</span> Final NOC from Department of Fire & Emergency Services. (Applicable to all building except residential building with height less than 15.0 mts.)
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
                        <span className="mr-2">4.8</span>
                        Photo copy of installed Rain water harvesting system.
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={rainwater_harvestRef} accept="*/*" onChange={(e) => handleLogoChange(e, setRainwater_harvest)} />
                        </div>
                        <button
                            onClick={() => rainwater_harvestRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {rainwater_harvest == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            rainwater_harvest != null ?
                                <a target="_blank" href={URL.createObjectURL(rainwater_harvest)}
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
                        <span className="mr-2">4.9</span> Existing building plan as per the actual construction carried out, if there is minor deviation from the approval plan.(If applicable)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={deviation_planRef} accept="*/*" onChange={(e) => handleLogoChange(e, setDeviation_plan)} />
                        </div>
                        <button
                            onClick={() => deviation_planRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {deviation_plan == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            deviation_plan != null ?
                                <a target="_blank" href={URL.createObjectURL(deviation_plan)}
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
                        <span className="mr-2">4.10</span> Form of Indemnity -Annexure 16 on Stamp paper of Rs. 20/- (If application is for Part Occupancy)
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={indemnityRef} accept="*/*" onChange={(e) => handleLogoChange(e, setIndemnity)} />
                        </div>
                        <button
                            onClick={() => indemnityRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {indemnity == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            indemnity != null ?
                                <a target="_blank" href={URL.createObjectURL(indemnity)}
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
                        <span className="mr-2">4.11</span> Valuation Certificate for the building constructed from the Registered Architect/engineer.
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={valuation_certificateRef} accept="*/*" onChange={(e) => handleLogoChange(e, setValuation_certificate)} />
                        </div>
                        <button
                            onClick={() => valuation_certificateRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {valuation_certificate == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            valuation_certificate != null ?
                                <a target="_blank" href={URL.createObjectURL(valuation_certificate)}
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
                        <span className="mr-2">4.12</span> Labour cess (@1% of Valuation of the building) Receipt
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={labour_cessRef} accept="*/*" onChange={(e) => handleLogoChange(e, setLabour_cess)} />
                        </div>
                        <button
                            onClick={() => labour_cessRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {labour_cess == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            labour_cess != null ?
                                <a target="_blank" href={URL.createObjectURL(labour_cess)}
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

export default Oc;