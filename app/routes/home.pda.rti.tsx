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

const RightToInformation: React.FC = (): JSX.Element => {
  const user = useLoaderData().user;
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  // const uidRef = useRef<HTMLInputElement>(null);

  const remarkRef = useRef<HTMLInputElement>(null);
  const applicationDateRef = useRef<HTMLInputElement>(null);
  const applicationDateToRef = useRef<HTMLInputElement>(null);
  const applicationNameRef = useRef<HTMLTextAreaElement>(null);
  const applicationDescRef = useRef<HTMLTextAreaElement>(null);

  const nakalRef = useRef<HTMLInputElement>(null);
  const [povertyLine, setPovertyLine] = useState(false);
  const [nakal, setNakal] = useState<File>();

  const [isChecked, setIsChecked] = useState(false);
  const sigimgRef = useRef<HTMLInputElement>(null);
  const [sigimg, setSigimg] = useState<File>();

  const navigator = useNavigate();

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
    const RTIScheme = z
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
        subject_info: z.string().nonempty("Enter subject information."),
        from_date: z.date({
          required_error: "Enter From date",
          invalid_type_error: "Enter a valid from date",
        }),
        to_date: z.date({
          required_error: "Enter To date",
          invalid_type_error: "Enter a valid to date",
        }),
        description: z.string().optional(),
        information: z.string().optional(),
        iagree: z.string().nonempty("I solemnly affirm & hereby."),
      })
      .strict();

    type RTIScheme = z.infer<typeof RTIScheme>;

    const rtiScheme: RTIScheme = {
      name: nameRef!.current!.value,
      address: addressRef!.current!.value,
      mobile: mobileRef!.current!.value,
      email: emailRef!.current!.value,
      user_uid: user.user_uid_four,
      subject_info: remarkRef!.current!.value,
      from_date: new Date(applicationDateRef!.current!.value),
      to_date: new Date(applicationDateToRef!.current!.value),
      description: applicationNameRef!.current!.value,
      information: applicationDescRef!.current!.value,
      iagree: isChecked ? "YES" : "NO",
    };

    const parsed = RTIScheme.safeParse(rtiScheme);
    if (parsed.success) {
      if (povertyLine) {
        // upload with proverty_line_url
        if (nakal == null || nakal == undefined) {
          return toast.error("Select Poverty Line Document.", {
            theme: "light",
          });
        }
        if (sigimg == null || sigimg == undefined) {
          return toast.error("Select Signature Image.", { theme: "light" });
        }
        const nakal_url = await UploadFile(nakal!);
        const sign_url = await UploadFile(sigimg!);

        if (nakal_url.status && sign_url.status) {
          const data = await ApiCall({
            query: `mutation createRti($createRtiInput:CreateRtiInput!){
                      createRti(createRtiInput:$createRtiInput){
                        id
                      }
                    }`,
            veriables: {
              createRtiInput: {
                userId: Number(user.id),
                name: rtiScheme.name,
                address: rtiScheme.address,
                email: rtiScheme.email,
                mobile: rtiScheme.mobile,
                user_uid: rtiScheme.user_uid,
                subject_info: rtiScheme.subject_info,
                description: rtiScheme.description,
                information: rtiScheme.information,
                proverty_line_url: nakal_url.data,
                signature_url: sign_url.data,
                iagree: rtiScheme.iagree,
                status: "ACTIVE",
                from_date: rtiScheme.from_date,
                to_date: rtiScheme.to_date,
              },
            },
          });
          if (!data.status) {
            toast.error(data.message, { theme: "light" });
          } else {
            navigator(`/home/pda/rtiview/${data.data.createRti.id}`);
          }
        } else {
          toast.error("Something went wrong unable to upload images.", {
            theme: "light",
          });
        }
      } else {
        // upload without proverty_line_url
        if (sigimg == null || sigimg == undefined) {
          return toast.error("Select Signature Image.", { theme: "light" });
        }
        const sign_url = await UploadFile(sigimg!);
        if (sign_url.status) {
          const data = await ApiCall({
            query: `
                    mutation createRti($createRtiInput:CreateRtiInput!){
                        createRti(createRtiInput:$createRtiInput){
                          id
                        }
                      }
                    `,
            veriables: {
              createRtiInput: {
                userId: Number(user.id),
                name: rtiScheme.name,
                address: rtiScheme.address,
                email: rtiScheme.email,
                mobile: rtiScheme.mobile,
                user_uid: rtiScheme.user_uid,
                subject_info: rtiScheme.subject_info,
                description: rtiScheme.description,
                information: rtiScheme.information,
                signature_url: sign_url.data,
                iagree: rtiScheme.iagree,
                status: "ACTIVE",
                from_date: rtiScheme.from_date,
                to_date: rtiScheme.to_date,
              },
            },
          });
          if (!data.status) {
            toast.error(data.message, { theme: "light" });
          } else {
            navigator(`/home/pda/rtiview/${data.data.createRti.id}`);
          }
        } else {
          toast.error("Something went wrong unable to upload images.", {
            theme: "light",
          });
        }
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };

  const handleFromDateChange = () => {
    const fromDateValue = applicationDateRef.current!.value;
    applicationDateToRef.current!.min = fromDateValue;
  };

  const handleToDateChange = () => {
    const toDateValue = applicationDateToRef.current!.value;
    applicationDateRef.current!.max = toDateValue;
  };
  useEffect(() => {
    nameRef!.current!.value = user.name ?? "";
    mobileRef!.current!.value = user.contact ?? "";
    emailRef!.current!.value = user.email ?? "";
    addressRef!.current!.value = user.address ?? "";
    // uidRef!.current!.value = user.user_uid_four ?? "";
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
          Right to Information Application
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          Format of Application for obtaining Information under Right to
          Information Act ,2005.{" "}
        </p>

        {/*--------------------- section 1 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            1. Applicant Details(s){" "}
          </p>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.1</span> Applicant Name
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
            <span className="mr-2">1.2</span> Applicant address
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
            <span className="mr-2">1.3</span> Applicant Contact Number
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
            <span className="mr-2">1.4</span> Applicant Email
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
            <span className="mr-2">1.5</span> Applicant UID
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <div className="w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2">
              {" "}
              XXXX-XXXX-{user.user_uid_four.toString()}
            </div>
          </div>
        </div>
        {/*--------------------- section 1 end here ------------------------- */}

        {/*--------------------- section 2 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            2. R.T.I. Details{" "}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.1</span> Subject matter of Information
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              ref={remarkRef}
              placeholder="Subject matter of Information"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.2</span> From Date
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={applicationDateRef}
              max={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              onInput={handleFromDateChange}
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.3</span> To Date
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <input
              type="date"
              ref={applicationDateToRef}
              max={new Date().toISOString().split("T")[0]}
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
              onInput={handleToDateChange}
            />
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.4</span> Description Of Information
            Required
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={applicationNameRef}
              placeholder="Description Of Information Needed"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
            ></textarea>
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.5</span> Additional Information Required
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <textarea
              ref={applicationDescRef}
              placeholder="Additional Information Needed"
              className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
            ></textarea>
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
        <div className="flex gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="text-xl font-normal text-left text-gray-700 ">
            3.1
          </div>
          <div className="flex items-start">
            <input
              checked={povertyLine}
              onChange={(e) => setPovertyLine(e.target.checked)}
              type="checkbox"
              id="checkbox"
              className="mr-2 my-2"
            />
            <label
              htmlFor="checkbox"
              className="text-xl font-normal text-left text-gray-700 "
            >
              Whether the Applicant is below Poverty Line(Select if Yes)
            </label>
          </div>
        </div>

        {povertyLine ? (
          <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
              <span className="mr-2">3.2</span> Poverty Line Document Upload
              <p className="text-rose-500 text-sm">
                ( Only Applicable in case Applicant is below Poverty
                Line.Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
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
        ) : null}

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

export default RightToInformation;
