import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { ApiCall, UploadFile } from "~/services/api";
import { z } from "zod";
import { uploadUrl } from "~/const";


const Petroleum: React.FC = (): JSX.Element => {

    const nameRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const mobileRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const companynaneRef = useRef<HTMLInputElement>(null);
    const companyreguibRef = useRef<HTMLInputElement>(null);
    const designationRef = useRef<HTMLInputElement>(null);

    const nocRef = useRef<HTMLSelectElement>(null);
    const classRef = useRef<HTMLSelectElement>(null);
    const outletRef = useRef<HTMLSelectElement>(null);
    const capacityRef = useRef<HTMLInputElement>(null);


    const nocFireRef = useRef<HTMLInputElement>(null);
    const [nocFire, setNocFire] = useState<File>();

    const naOrderRef = useRef<HTMLInputElement>(null);
    const [naOrder, setNaOrder] = useState<File>();

    const sanadOrderRef = useRef<HTMLInputElement>(null);
    const [sanadOrder, setSanadOrder] = useState<File>();

    const coastGuardRef = useRef<HTMLInputElement>(null);
    const [coastGuard, setCoastGuard] = useState<File>();

    const sitePlanRef = useRef<HTMLInputElement>(null);
    const [sitePlan, setSitePlan] = useState<File>();

    const explosiveRef = useRef<HTMLInputElement>(null);
    const [explosive, setExplosive] = useState<File>();




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
    }, []);

    const setlanddetails = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSubdivision = subdivision.find((val) => val.sub_division === e.target.value);
        if (selectedSubdivision) {
            setLandDetails(val => ({ land: selectedSubdivision.owner_name, area: selectedSubdivision.area }))
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
        const PetroleumScheme = z
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
                company_name: z
                    .string()
                    .optional(),
                company_region: z
                    .string()
                    .optional(),
                designation: z
                    .string()
                    .optional(),
                village_id: z
                    .number({ invalid_type_error: "Select a valid village", required_error: "Select a village" })
                    .optional(),
                survey_no: z
                    .string()
                    .optional(),
                sub_division: z
                    .string()
                    .optional(),
                noc_type: z
                    .string()
                    .optional(),
                class_type: z
                    .string()
                    .optional(),
                outlet_type: z
                    .string()
                    .optional(),
                capacity: z
                    .number()
                    .optional(),
                iagree: z
                    .string()
                    .nonempty("Check the  agree box"),
            })
            .strict();

        type PetroleumScheme = z.infer<typeof PetroleumScheme>;

        const petroleumScheme: PetroleumScheme = {
            name: nameRef!.current!.value,
            address: addressRef!.current!.value,
            mobile: mobileRef!.current!.value,
            email: emailRef!.current!.value,
            company_name: emailRef!.current!.value,
            company_region: emailRef!.current!.value,
            designation: emailRef!.current!.value,
            village_id: parseInt(villageRef!.current!.value),
            survey_no: surveyRef!.current!.value,
            sub_division: divisionRef!.current!.value,
            noc_type: nocRef!.current!.value,
            class_type: classRef!.current!.value,
            outlet_type: outletRef!.current!.value,
            capacity: Number(capacityRef!.current!.value),
            iagree: "YES"
        };

        const parsed = PetroleumScheme.safeParse(petroleumScheme);

        if (parsed.success) {

            let req: { [key: string]: any } = {
                userId: 20,
                name: petroleumScheme.name,
                address: petroleumScheme.address,
                email: petroleumScheme.email,
                mobile: petroleumScheme.mobile,
                company_name: petroleumScheme.company_name,
                company_region: petroleumScheme.company_region,
                designation: petroleumScheme.designation,
                village_id: petroleumScheme.village_id,
                survey_no: petroleumScheme.survey_no,
                sub_division: petroleumScheme.sub_division,
                noc_type: petroleumScheme.noc_type,
                class_type: petroleumScheme.class_type,
                outlet_type: petroleumScheme.outlet_type,
                capacity: petroleumScheme.capacity,
                iagree: petroleumScheme.iagree,
            }





            if (!(nocFire == null || nocFire == undefined)) {
                const fileone = await UploadFile(nocFire);
                if (fileone.status) {
                    req.noc_fire_url = fileone.data
                } else {
                    toast.error(fileone.message, { theme: "light" });
                }
            }

            if (!(naOrder == null || naOrder == undefined)) {
                const fileone = await UploadFile(naOrder);
                if (fileone.status) {
                    req.na_order_url = fileone.data
                } else {
                    toast.error(fileone.message, { theme: "light" });
                }
            }
            if (!(sanadOrder == null || sanadOrder == undefined)) {
                const fileone = await UploadFile(sanadOrder);
                if (fileone.status) {
                    req.sanad_url = fileone.data
                } else {
                    toast.error(fileone.message, { theme: "light" });
                }
            }
            if (!(coastGuard == null || coastGuard == undefined)) {
                const fileone = await UploadFile(coastGuard);
                if (fileone.status) {
                    req.coastguard_url = fileone.data
                } else {
                    toast.error(fileone.message, { theme: "light" });
                }
            }
            if (!(sitePlan == null || sitePlan == undefined)) {
                const fileone = await UploadFile(sitePlan);
                if (fileone.status) {
                    req.plan_url = fileone.data
                } else {
                    toast.error(fileone.message, { theme: "light" });
                }
            }
            if (!(explosive == null || explosive == undefined)) {
                const fileone = await UploadFile(explosive);
                if (fileone.status) {
                    req.explosive_url = fileone.data
                } else {
                    toast.error(fileone.message, { theme: "light" });
                }
            }


            const data = await ApiCall({
                query: `
                    mutation createPetroleum($createPetroleumInput:CreatePetroleumInput!){
                        createPetroleum(createPetroleumInput:$createPetroleumInput){
                          id
                        }
                      }
                    `,
                veriables: {
                    createPetroleumInput: req
                },
            });
            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                navigator(`/home/pda/petroleumview/${data.data.createPetroleum.id}`);
            }
        } else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }
    }


    return (
        <>
            <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
                <h1 className="text-gray-800 text-2xl font-semibold text-center">Petroleum NOC</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <p className="text-center font-semibold text-xl text-gray-800"> SUBJECT  :  Application for issuance of Petroleum NOC </p>
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
                        <span className="mr-2">2.5</span> Area
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
                        <span className="mr-2">2.5</span> Company Name
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={companynaneRef}
                            placeholder="Company Name"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.6</span> Company Region
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={companyreguibRef}
                            placeholder="Company Region"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">2.7</span> Designation
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={designationRef}
                            placeholder="Designation"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>

                {/*--------------------- section 2 end here ------------------------- */}


                {/*--------------------- section 3 start here ------------------------- */}
                <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 3. Permission Details </p>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.1</span> NOC Type
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select ref={nocRef} defaultValue={"0"} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select NOC Type</option>
                            <option value="NOCTYPEONE" className="bg-white text-black text-lg" >NOC Type 1</option>
                            <option value="NOCTYPETWO" className="bg-white text-black text-lg" >NOC Type 2</option>
                            <option value="NOCTYPETHREE" className="bg-white text-black text-lg" >NOC Type 3</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.2</span> Class Type
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select ref={classRef} defaultValue={"0"} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select Class Type</option>
                            <option value="CLASSTYPEONE" className="bg-white text-black text-lg" >Class Type 1</option>
                            <option value="CLASSTYPETWO" className="bg-white text-black text-lg" >Class Type 2</option>
                            <option value="CLASSTYPETHREE" className="bg-white text-black text-lg" >Class Type 3</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">3.3</span> Outlet Type
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select ref={outletRef} defaultValue={"0"} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select Outlet Type</option>
                            <option value="OUTLETTYPEONE" className="bg-white text-black text-lg" >Outlet Type 1</option>
                            <option value="OUTLETTYPETWO" className="bg-white text-black text-lg" >Outlet Type 2</option>
                            <option value="OUTLETTYPETHREE" className="bg-white text-black text-lg" >Outlet Type 3</option>
                        </select>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.4</span> Capacity
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={capacityRef}
                            placeholder="Capacity"
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
                        <span className="mr-2">4.1</span> NOC Fire
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={nocFireRef} accept="*/*" onChange={(e) => handleLogoChange(e, setNocFire)} />
                        </div>
                        <button
                            onClick={() => nocFireRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {nocFire == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            nocFire != null ?
                                <a target="_blank" href={URL.createObjectURL(nocFire)}
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
                        <span className="mr-2">4.2</span> NA Order
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={naOrderRef} accept="*/*" onChange={(e) => handleLogoChange(e, setNaOrder)} />
                        </div>
                        <button
                            onClick={() => naOrderRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {naOrder == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            naOrder != null ?
                                <a target="_blank" href={URL.createObjectURL(naOrder)}
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
                        <span className="mr-2">4.3</span> Sanad Order
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={sanadOrderRef} accept="*/*" onChange={(e) => handleLogoChange(e, setSanadOrder)} />
                        </div>
                        <button
                            onClick={() => sanadOrderRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {sanadOrder == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            sanadOrder != null ?
                                <a target="_blank" href={URL.createObjectURL(sanadOrder)}
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
                        <span className="mr-2">4.4</span> Coast Guard NOC
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={coastGuardRef} accept="*/*" onChange={(e) => handleLogoChange(e, setCoastGuard)} />
                        </div>
                        <button
                            onClick={() => coastGuardRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {coastGuard == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            coastGuard != null ?
                                <a target="_blank" href={URL.createObjectURL(coastGuard)}
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
                        <span className="mr-2">4.5</span> Site Plan Attachment
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={sitePlanRef} accept="*/*" onChange={(e) => handleLogoChange(e, setSitePlan)} />
                        </div>
                        <button
                            onClick={() => sitePlanRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {sitePlan == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            sitePlan != null ?
                                <a target="_blank" href={URL.createObjectURL(sitePlan)}
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
                        <span className="mr-2">4.6</span> Explosive Attachment
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={explosiveRef} accept="*/*" onChange={(e) => handleLogoChange(e, setExplosive)} />
                        </div>
                        <button
                            onClick={() => explosiveRef.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {explosive == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            explosive != null ?
                                <a target="_blank" href={URL.createObjectURL(explosive)}
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

                {/* <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
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
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <button
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> Attach Doc.
                            </div>
                        </button>
                    </div>
                </div> */}
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


export default Petroleum;