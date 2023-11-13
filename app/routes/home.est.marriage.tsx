import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Fa6SolidDownload, Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { ApiCall, UploadFile } from "~/services/api";
import { toast } from "react-toastify";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { userPrefs } from "~/cookies";
import { z } from "zod";
import { checkUID } from "~/utils";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
// import customParseFormat from 'dayjs/plugin/customParseFormat';

// dayjs.extend(customParseFormat);

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



const Marriage: React.FC = (): JSX.Element => {
    const user = useLoaderData().user;



    const nameRef = useRef<HTMLInputElement>(null);
    const mobileRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const uidRef = useRef<HTMLInputElement>(null);

    const villageRef = useRef<HTMLSelectElement>(null);
    const [village, setVillage] = useState<any[]>([]);

    const from_dateRef = useRef<HTMLInputElement>(null);
    const to_dateRef = useRef<HTMLInputElement>(null);

    const [dates, setDates] = useState<string[]>([]);

    const event_nameRef = useRef<HTMLInputElement>(null);
    const event_addressRef = useRef<HTMLTextAreaElement>(null);
    const relationRef = useRef<HTMLInputElement>(null);

    // const remarksRef = useRef<HTMLInputElement>(null);



    const witness_1_url_Ref = useRef<HTMLInputElement>(null);
    const [witness_1_url, setWitness_1_url] = useState<File>();

    const witness_2_url_Ref = useRef<HTMLInputElement>(null);
    const [witness_2_url, setWitness_2_url] = useState<File>();

    const applicant_uid_url_Ref = useRef<HTMLInputElement>(null);
    const [applicant_uid_url, setApplicant_uid_url] = useState<File>();

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

        const MarriageScheme = z
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
                    .length(10, "Contact Number should be 10 digit."),
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
                from_date: z
                    .date({ required_error: "Enter From date", invalid_type_error: "Enter a valid from date" }),
                to_date: z
                    .date({ required_error: "Enter To date", invalid_type_error: "Enter a valid to date" }),
                event_name: z
                    .string()
                    .nonempty("Event Name is required."),
                event_address: z
                    .string()
                    .nonempty("Event Address is required."),
                relation: z
                    .string()
                    .nonempty("Applicant relation is required."),
                iagree: z
                    .string()
                    .nonempty("I solemnly affirm & hereby."),
            })
            .strict()
            .refine(obj => obj.village_id != 0, {
                message: "Select your village",
                path: ["village_id"]
            })
            .refine(obj => obj.from_date < obj.to_date, {
                message: "From date must be less than To date",
                path: ["from_date", "to_date"],
            });

        type MarriageScheme = z.infer<typeof MarriageScheme>;

        const marriageScheme: MarriageScheme = {
            name: nameRef!.current!.value,
            address: addressRef!.current!.value,
            mobile: mobileRef!.current!.value,
            email: emailRef!.current!.value,
            user_uid: uidRef!.current!.value,
            village_id: parseInt(villageRef!.current!.value),
            from_date: parseDateString(dates[0]),
            to_date: parseDateString(dates[1]),
            iagree: isChecked ? "YES" : "NO",
            event_name: event_nameRef!.current!.value,
            event_address: event_addressRef!.current!.value,
            relation: relationRef!.current!.value,
        };
        // remarks: remarksRef!.current!.value,

        {/*--------------------- Karan start here ------------------------- */ }
        const parsed = MarriageScheme.safeParse(marriageScheme);
        if (parsed.success) {





            if (sigimg == null || sigimg == undefined) { toast.error("Select Signature Image.", { theme: "light" }); }
            const sign_url = await UploadFile(sigimg!);

            if (witness_1_url == null || witness_1_url == undefined) { toast.error("Select Signature Image.", { theme: "light" }); }
            const witness_1_urlt = await UploadFile(sigimg!);

            if (witness_2_url == null || witness_2_url == undefined) { toast.error("Select Signature Image.", { theme: "light" }); }
            const witness_2_urlt = await UploadFile(sigimg!);

            if (applicant_uid_url == null || applicant_uid_url == undefined) { toast.error("Select Signature Image.", { theme: "light" }); }
            const applicant_uid_urlt = await UploadFile(sigimg!);

            if (undertaking_url == null || undertaking_url == undefined) { toast.error("Select Signature Image.", { theme: "light" }); }
            const undertaking_urlt = await UploadFile(sigimg!);




            if (witness_1_urlt.status && sign_url.status && witness_2_urlt && applicant_uid_urlt && undertaking_urlt) {
                const data = await ApiCall({
                    query: `
                    mutation createMarriage($createMarriageInput:CreateMarriageInput!){
                        createMarriage(createMarriageInput:$createMarriageInput){
                          id
                        }
                      }
                    `,
                    veriables: {
                        createMarriageInput: {
                            userId: Number(user.id),
                            name: marriageScheme.name,
                            address: marriageScheme.address,
                            email: marriageScheme.email,
                            mobile: marriageScheme.mobile,
                            user_uid: marriageScheme.user_uid,
                            village_id: marriageScheme.village_id,
                            signature_url: sign_url.data,
                            from_date: marriageScheme.from_date,
                            to_date: marriageScheme.to_date,
                            iagree: marriageScheme.iagree,
                            event_name: marriageScheme.event_name,
                            event_address: marriageScheme.event_address,
                            relation: marriageScheme.relation,
                            witness_1_url: witness_1_urlt.data,
                            witness_2_url: witness_2_urlt.data,
                            applicant_uid_url: applicant_uid_urlt.data,
                            undertaking_url: undertaking_urlt.data,
                            status: "ACTIVE",
                        }
                    },
                });
                if (!data.status) {
                    toast.error(data.message, { theme: "light" });
                } else {
                    navigator(`/home/est/marriageview/${data.data.createMarriage.id}`);
                }
            }
            else {
                toast.error("Something want wrong unable to upload images.", { theme: "light" });
            }
        } else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }
    }



    const handleDateChange = (values: any, datestring: any) => {
        setDates(datestring);
    };

    const disabledDate = (current: any) => {

        const currentDate = dayjs();

        return current && (current < currentDate.startOf('day'));
    };


    const parseDateString = (dateString: string): Date => {
        if (dateString == undefined) return new Date();
        const dateParts = dateString.split("-");

        if (dateParts.length === 3) {
            const year = parseInt(dateParts[2]);
            const month = parseInt(dateParts[1]) - 1;
            const day = parseInt(dateParts[0]);

            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                return new Date(year, month, day);
            }
        }
        return new Date(); // Return null if the date string is not valid
    }


    return (
        <>
            <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
                <h1 className="text-gray-800 text-xl md:text-3xl font-semibold text-center">Marriage Permission</h1>
                <div className="w-full flex gap-4 my-4">
                    <div className="grow bg-gray-700 h-[2px]"></div>
                    <div className="w-10 bg-gray-500 h-[3px]"></div>
                    <div className="grow bg-gray-700 h-[2px]"></div>
                </div>
                <p className="text-center font-semibold text-lg md:text-xl text-gray-800"> Subject  :  Request for Obtaining Marriage Permission. </p>


                {/*--------------------- section 1 start here ------------------------- */}
                <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white">1. Village Details </p>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">1.1</span> Applicant village
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <select ref={villageRef} defaultValue={"0"} className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2">
                            <option value="0" className="bg-white text-blakc text-lg" disabled>Select village</option>
                            {village.map((val: any, index: number) =>
                                <option key={index} value={val.id} className="bg-white text-black text-lg" >{val.name}</option>
                            )}
                        </select>
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
                        <span className="mr-2">2.5</span> Applicant Aadhar Number
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={uidRef}
                            placeholder="Please type Aadhar number"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                {/*--------------------- section 2 end here ------------------------- */}




                {/*--------------------- section 3 start here ------------------------- */}

                <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 3. Event Details </p>
                </div>

                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.1</span> Name of the Bride / Groom
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={event_nameRef}
                            placeholder="Bride/Groom Name"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.2</span> Event address
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <textarea
                            ref={event_addressRef}
                            placeholder="Event address"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.3</span> Applicant Relation
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            ref={relationRef}
                            placeholder="Applicant Relation"
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div>
                <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.4</span> Event From Date to To Date
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        {/* <input
                            type="date"
                            ref={from_dateRef}
                            min={new Date().toISOString().split('T')[0]}
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        /> */}
                        <RangePicker onChange={handleDateChange}
                            disabledDate={disabledDate}
                            format={"DD-MM-YYYY"}
                        ></RangePicker>
                    </div>
                </div>
                {/* <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                        <span className="mr-2">3.5</span> Event To Date
                    </div>
                    <div className="flex-none lg:flex-1 w-full lg:w-auto">
                        <input
                            type="date"
                            ref={to_dateRef}
                            min={new Date().toISOString().split('T')[0]}
                            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                        />
                    </div>
                </div> */}
                {/*--------------------- section 3 end here ------------------------- */}

                {/*--------------------- section 4 start here ------------------------- */}

                <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
                    <p className="text-left font-semibold text-xl text-white"> 4. Attachment(s) </p>
                </div>

                <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
                    <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
                        <span className="mr-2">4.1</span> First Witness UIDAI Aadhaar
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={witness_1_url_Ref} onChange={(e) => handleLogoChange(e, setWitness_1_url)} />
                        </div>
                        <button
                            onClick={() => witness_1_url_Ref.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {witness_1_url == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            witness_1_url != null ?
                                <a target="_blank" href={URL.createObjectURL(witness_1_url)}
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
                        <span className="mr-2">4.2</span> Second Witness UIDAI Aadhaar
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={witness_2_url_Ref} onChange={(e) => handleLogoChange(e, setWitness_2_url)} />
                        </div>
                        <button
                            onClick={() => witness_2_url_Ref.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {witness_2_url == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            witness_2_url != null ?
                                <a target="_blank" href={URL.createObjectURL(witness_2_url)}
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
                        <span className="mr-2">4.3</span> Applicant Aadhar Upload
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={applicant_uid_url_Ref} onChange={(e) => handleLogoChange(e, setApplicant_uid_url)} />
                        </div>
                        <button
                            onClick={() => applicant_uid_url_Ref.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {applicant_uid_url == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            applicant_uid_url != null ?
                                <a target="_blank" href={URL.createObjectURL(applicant_uid_url)}
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
                        <span className="mr-2">4.4</span> Undertaking
                        <a href="/undertaking_establish.pdf" download className="text-blue-500 flex gap-2 items-center"> <Fa6SolidDownload className="text-lg" /> <p> Click to Download Format</p></a>
                        <p className="text-rose-500 text-sm">
                            ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )</p>
                    </div>
                    <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                        <div className="hidden">
                            <input type="file" ref={undertaking_url_Ref} onChange={(e) => handleLogoChange(e, setUndertaking_url)} />
                        </div>
                        <button
                            onClick={() => undertaking_url_Ref.current?.click()}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <Fa6SolidLink></Fa6SolidLink> {undertaking_url == null ? "Attach Doc." : "Update Doc."}
                            </div>
                        </button>
                        {
                            undertaking_url != null ?
                                <a target="_blank" href={URL.createObjectURL(undertaking_url)}
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
                        5. Applicant Declaration and Signature </p>
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


export default Marriage;