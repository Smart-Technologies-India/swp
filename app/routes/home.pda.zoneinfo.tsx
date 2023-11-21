import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { ApiCall, UploadFile } from "~/services/api";
import { toast } from "react-toastify";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { userPrefs } from "~/cookies";
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
      id: parseInt(cookie.id!),
    },
  });
  return json({ user: userdata.data.getUserById });
};

const ZoneInofrmation: React.FC = (): JSX.Element => {
  const user = useLoaderData().user;
  const nameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  // const uidRef = useRef<HTMLInputElement>(null);
  // console.log(user);

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
  const [landDetails, setLandDetails] = useState<landDetailsType>({
    area: null,
    land: null,
  });

  const nakalRef = useRef<HTMLInputElement>(null);
  const [nakal, setNakal] = useState<File>();

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
          villageId: parseInt(villageRef!.current!.value),
        },
      },
    });
    if (survey.status) {
      setSurvey((val) => survey.data.getSurveyNumber);
    } else {
      toast.error("No Survey Number exist on this village.", {
        theme: "light",
      });
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
        },
      },
    });

    if (subdivision.status) {
      setSubdivision((val) => subdivision.data.getSubDivision);
    } else {
      toast.error("No sub division exist on this Survey Number.", {
        theme: "light",
      });
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

  const setlanddetails = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubdivision = subdivision.find(
      (val) => val.sub_division === e.target.value
    );
    if (selectedSubdivision) {
      setLandDetails((val) => ({
        land: selectedSubdivision.owner_name,
        area: selectedSubdivision.area,
      }));
      nameRef!.current!.value = `${
        selectedSubdivision.owner_name.toString().split(",")[0]
      } ${
        selectedSubdivision.owner_name.toString().includes(",")
          ? " and others"
          : ""
      }`;
    }
  };

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
    const ZoneScheme = z
      .object({
        name: z.string().nonempty("Applicant Name is required."),
        address: z.string().nonempty("Applicant address is required."),
        mobile: z
          .string()
          .nonempty("Applicant Contact Number is required.")
          .length(10, "Mobile Number shoule be 10 digit."),
        email: z.string().email("Enter a valid email.").optional(),
        user_uid: z.string().optional(),
        village_id: z
          .number({
            invalid_type_error: "Select a valid village",
            required_error: "Select a village",
          })
          .refine((val) => val != 0, {
            message: "Please select village",
          }),
        survey_no: z.string().nonempty("I solemnly affirm & hereby."),
        sub_division: z.string().nonempty("I solemnly affirm & hereby."),
        iagree: z.string().nonempty("I solemnly affirm & hereby."),
      })
      .strict();

    type ZoneScheme = z.infer<typeof ZoneScheme>;

    const zoneScheme: ZoneScheme = {
      name: nameRef!.current!.value,
      address: addressRef!.current!.value,
      mobile: mobileRef!.current!.value,
      email: emailRef!.current!.value,
      user_uid: user.user_uid_four,
      village_id: parseInt(villageRef!.current!.value),
      survey_no: surveyRef!.current!.value,
      sub_division: divisionRef!.current!.value,
      iagree: isChecked ? "YES" : "NO",
    };

    const parsed = ZoneScheme.safeParse(zoneScheme);
    if (parsed.success) {
      if (nakal == null || nakal == undefined) {
        toast.error("Select Poverty Line Document.", { theme: "light" });
      }
      if (sigimg == null || sigimg == undefined) {
        toast.error("Select Signature Image.", { theme: "light" });
      }

      const nakal_url = await UploadFile(nakal!);
      const sign_url = await UploadFile(sigimg!);

      if (nakal_url.status && sign_url.status) {
        const data = await ApiCall({
          query: `
                    mutation createZone($createZoneinfoInput:CreateZoneinfoInput!){
                        createZone(createZoneinfoInput:$createZoneinfoInput){
                          id
                        }
                      }
                    `,
          veriables: {
            createZoneinfoInput: {
              userId: Number(user.id),
              name: zoneScheme.name,
              address: zoneScheme.address,
              email: zoneScheme.email,
              mobile: zoneScheme.mobile,
              user_uid: zoneScheme.user_uid,
              village_id: zoneScheme.village_id,
              survey_no: zoneScheme.survey_no,
              sub_division: zoneScheme.sub_division,
              nakel_url_1_14: nakal_url.data,
              signature_url: sign_url.data,
              iagree: zoneScheme.iagree,
              status: "ACTIVE",
            },
          },
        });
        if (!data.status) {
          toast.error(data.message, { theme: "light" });
        } else {
          navigator(`/home/pda/zoneinfoview/${data.data.createZone.id}`);
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
          Zone Information
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          SUBJECT : Request for Obtaining Zone Information.{" "}
        </p>

        {/*--------------------- section 1 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            1. Land Details{" "}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">1.1</span> Applicant village
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <select
              ref={villageRef}
              onChange={getSurveyNumber}
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
            <span className="mr-2">1.2</span> Survey No
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <select
              disabled={villageRef.current?.value == "0" ? true : false}
              ref={surveyRef}
              defaultValue={"0"}
              onChange={getSubDivision}
              className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2"
            >
              <option
                value="0"
                className="bg-white text-blakc text-lg"
                disabled
              >
                Select Survey No
              </option>
              {survey.map((val: any, index: number) => (
                <option
                  key={index}
                  value={val.survey_no}
                  className="bg-white text-black text-lg"
                >
                  {val.survey_no}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.3</span> Sub Division
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <select
              disabled={surveyRef.current?.value == "0"}
              ref={divisionRef}
              defaultValue={"0"}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setlanddetails(e)
              }
              className="w-full bg-transparent fill-none outline-none border-2 border-black text-black p-2"
            >
              <option
                value="0"
                className="bg-white text-blakc text-lg"
                disabled
              >
                Select Sub Division
              </option>
              {subdivision.map((val: any, index: number) => (
                <option
                  key={index}
                  value={val.sub_division}
                  className="bg-white text-black text-lg"
                >
                  {val.sub_division}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.4</span> Land Owner
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {landDetails.land == null ||
            landDetails.land == undefined ||
            landDetails.land == ""
              ? "-"
              : landDetails.land}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.5</span> Area
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {landDetails.area == null ||
            landDetails.area == undefined ||
            landDetails.area == ""
              ? "-"
              : landDetails.area}
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
            3. Document Attachment{" "}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">3.1</span> 1/14 Nakal
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={nakalRef}
                accept="*/*"
                onChange={(e) => handleLogoChange(e, setNakal)}
              />
            </div>
            <button
              onClick={() => nakalRef.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {nakal == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {nakal != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(nakal)}
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
              className="mr-2 my-2"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
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
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
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

export default ZoneInofrmation;
