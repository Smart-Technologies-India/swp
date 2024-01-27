import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { ApiCall, UploadFile } from "~/services/api";
import { toast } from "react-toastify";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { userPrefs } from "~/cookies";
import QueryTabs from "~/components/QueryTabs";
import { encrypt } from "~/utils";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
        query getRoadshowById($id:Int!){
            getRoadshowById(id:$id){
              id,
              name,
              address,
              mobile,
              email,
              user_uid,
              userId,
              village_id,
              from_date,
              to_date,
              event_name,
              event_address,
              relation,
			        route_info,
              doc_1_url,
              doc_2_url,
              applicant_uid_url,
              undertaking_url,
              iagree,
              signature_url,
              condition_to_follow,
              createdAt
            }
          }
      `,
    veriables: {
      id: parseInt(id!),
    },
  });

  const submit = await ApiCall({
    query: `
        query searchCommon($searchCommonInput:SearchCommonInput!){
            searchCommon(searchCommonInput:$searchCommonInput){
              id,
              village,
              name,
              form_type,
              user_id,
              auth_user_id,
              focal_user_id,
              intra_user_id,
              inter_user_id,
              number,
              form_status,
              query_status, 
              event_date
            }
          }
      `,
    veriables: {
      searchCommonInput: {
        form_id: parseInt(id!),
        form_type: "ROADSHOW",
      },
    },
  });

  const village = await ApiCall({
    query: `
        query getAllVillageById($id:Int!){
          getAllVillageById(id:$id){
              id,
              name
            }
          }
      `,
    veriables: {
      id: parseInt(data.data.getRoadshowById.village_id),
    },
  });

  return json({
    user: cookie,
    from_data: data.data.getRoadshowById,
    submit: submit.status,
    village: village.data.getAllVillageById,
    common: submit.data.searchCommon,
  });
};

const RoadshowView: React.FC = (): JSX.Element => {
  const loader = useLoaderData();
  const user = loader.user;
  const villagedata = loader.village;
  const from_data = loader.from_data;

  const isSubmited = loader.submit;

  const isUser = user.role == "USER";

  const common = isSubmited ? loader.common[0] : null;

  const navigator = useNavigate();

  const submit = async () => {
    const data = await ApiCall({
      query: `
            mutation createCommon($createCommonInput:CreateCommonInput!){
                createCommon(createCommonInput:$createCommonInput){
                  id,
                }
              }
            `,
      veriables: {
        createCommonInput: {
          form_id: Number(from_data.id),
          user_id: Number(user.id),
          auth_user_id: "23",
          focal_user_id: "21",
          intra_user_id: "21,23",
          inter_user_id: "0",
          village: villagedata.name,
          name: from_data.event_name,
          number: from_data.mobile.toString(),
          event_date: from_data.from_date,
          form_status: 1,
          form_type: "ROADSHOW",
          query_status: "SUBMIT",
        },
      },
    });
    if (!data.status) {
      toast.error(data.message, { theme: "light" });
    } else {
      navigator("/home/");
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

  const [querybox, setQueryBox] = useState<boolean>(false);
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const rejectRef = useRef<HTMLTextAreaElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File>();

  const submitQuery = async () => {
    if (queryRef.current?.value == null || queryRef.current?.value == "")
      return toast.error("Remark is required", { theme: "light" });
    const req: { [key: string]: any } = {
      stage: "ROADSHOW",
      form_id: from_data.id,
      from_user_id: Number(user.id),
      to_user_id: from_data.userId,
      form_status: common.form_status,
      query_type: "PUBLIC",
      remark: queryRef.current?.value,
      query_status: "SENT",
    };

    if (attachment != null) {
      const attach = await UploadFile(attachment);
      if (attach.status) {
        req.doc_url = attach.data;
      } else {
        return toast.error("Unable to upload attachment", { theme: "light" });
      }
    }

    const data = await ApiCall({
      query: `
            mutation createQuery($createQueryInput:CreateQueryInput!){
                createQuery(createQueryInput:$createQueryInput){
                  id,
                }
              }
            `,
      veriables: {
        createQueryInput: req,
      },
    });

    if (data.status) {
      setQueryBox((val) => false);
      return toast.success("Query sent successfully.", { theme: "light" });
    } else {
      return toast.error(data.message, { theme: "light" });
    }
  };

  const [forwardbox, setForwardBox] = useState<boolean>(false);
  const forwardRef = useRef<HTMLTextAreaElement>(null);

  interface forwardqueryType {
    title: string;
    formstatus: number;
    querytype: string;
    authuserid: string;
    foacaluserid: string;
    intrauserid: string;
    interuserid: string;
    touserid: number;
    querystatus: string;
  }

  const [nextdata, setNextData] = useState<forwardqueryType>({
    title: "Send to Suptd",
    authuserid: "0",
    foacaluserid: "0",
    intrauserid: "0",
    interuserid: "0",
    formstatus: 0,
    querytype: "NONE",
    touserid: 0,
    querystatus: "NONE",
  });

  const forwardQuery = async (args: forwardqueryType) => {
    if (forwardRef.current?.value == null || forwardRef.current?.value == "")
      return toast.error("Remark is required", { theme: "light" });
    const req: { [key: string]: any } = {
      stage: "ROADSHOW",
      form_id: from_data.id,
      from_user_id: Number(user.id),
      to_user_id: args.touserid,
      form_status: args.formstatus,
      query_type: args.querytype,
      remark: forwardRef.current?.value,
      query_status: "SENT",
    };

    if (attachment != null) {
      const attach = await UploadFile(attachment);
      if (attach.status) {
        req.doc_url = attach.data;
      } else {
        return toast.error("Unable to upload attachment", { theme: "light" });
      }
    }

    const data = await ApiCall({
      query: `
            mutation createQuery($createQueryInput:CreateQueryInput!){
                createQuery(createQueryInput:$createQueryInput){
                  id,
                }
              }
            `,
      veriables: {
        createQueryInput: req,
      },
    });

    if (data.status) {
      const data = await ApiCall({
        query: `
                mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                    updateCommonById(updateCommonInput:$updateCommonInput){
                      id,
                    }
                  }
              `,
        veriables: {
          updateCommonInput: {
            id: common.id,
            auth_user_id: args.authuserid,
            focal_user_id: args.foacaluserid,
            intra_user_id: args.intrauserid,
            inter_user_id: args.interuserid,
            form_status: args.formstatus,
            query_status: args.querystatus,
          },
        },
      });

      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        setForwardBox((val) => false);
        toast.success("Form sent successfully.", { theme: "light" });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } else {
      return toast.error(data.message, { theme: "light" });
    }
  };

  const [notings, setNotings] = useState<any[]>([]);

  const getNotings = async () => {
    const data = await ApiCall({
      query: `
                query searchQuery($searchQueryInput:SearchQueryInput!){
                    searchQuery(searchQueryInput:$searchQueryInput){
                        id,
                        from_user_id,
                        to_user_id
                        remark
                        doc_url,
                        createdAt,
                        query_type,
                        from_user{
                            name,
                            role
                        },
                        to_user{
                            name,
                            role
                        }
                    }
                  }
                `,
      veriables: {
        searchQueryInput: {
          form_id: from_data.id,
          stage: "ROADSHOW",
          query_type: isUser ? "PUBLIC" : "INTRA",
        },
      },
    });
    if (data.status) {
      setNotings((val) => data.data.searchQuery);
    }
  };
  useEffect(() => {
    getNotings();
  }, []);

  const [rejectbox, setRejectBox] = useState<boolean>(false);
  const [rejectid, setRejectid] = useState<number>(0);

  const reject = async (id: number) => {
    if (rejectRef.current?.value == null || rejectRef.current?.value == "")
      return toast.error("Reject reason is required", { theme: "light" });
    if (rejectid == 0)
      return toast.error("Select the form for rejection.", { theme: "light" });
    const data = await ApiCall({
      query: `
            mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                updateCommonById(updateCommonInput:$updateCommonInput){
                  id,
                }
              }
          `,
      veriables: {
        updateCommonInput: {
          id: id,
          query_status: "REJECTED",
        },
      },
    });

    if (!data.status) {
      toast.error(data.message, { theme: "light" });
    } else {
      const req: { [key: string]: any } = {
        stage: "ROADSHOW",
        form_id: from_data.id,
        from_user_id: Number(user.id),
        to_user_id: from_data.userId,
        form_status: common.form_status,
        query_type: "PUBLIC",
        remark: rejectRef.current?.value,
        query_status: "SENT",
      };

      const data = await ApiCall({
        query: `
                mutation createQuery($createQueryInput:CreateQueryInput!){
                    createQuery(createQueryInput:$createQueryInput){
                      id,
                    }
                  }
                `,
        veriables: {
          createQueryInput: req,
        },
      });

      if (data.status) {
        setQueryBox((val) => false);
        toast.success("Form Rejected successfully.", { theme: "light" });
      } else {
        toast.error(data.message, { theme: "light" });
      }
    }
    setRejectBox(false);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const [notingsbox, setNotingsBox] = useState<boolean>(false);
  const noticeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (noticeRef && from_data.condition_to_follow) {
      noticeRef!.current!.value =
        from_data.condition_to_follow.replace(/\\n/g, "\n") ?? "";
    }
  }, []);

  const sendnotingpint = async (): Promise<boolean> => {
    if (
      noticeRef!.current!.value == null ||
      noticeRef!.current!.value == undefined ||
      noticeRef!.current!.value == ""
    ) {
      toast.error("Enter some noting points...", { theme: "light" });
      return false;
    }

    const data = await ApiCall({
      query: `
            mutation updateRoadshowById($updateRoadshowInput:UpdateRoadshowInput!){
                updateRoadshowById(updateRoadshowInput:$updateRoadshowInput){
                  id
                }
              }
            `,
      veriables: {
        updateRoadshowInput: {
          id: Number(from_data.id),
          condition_to_follow: noticeRef!.current!.value.replace(/\n/g, "\\n"),
        },
      },
    });
    if (!data.status) {
      setNotingsBox((val) => false);
      toast.error(data.message, { theme: "light" });
    } else {
      setNotingsBox((val) => false);
      setForwardBox((val) => true);
    }

    return false;
  };

  return (
    <>
      {/* notings box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          notingsbox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">Notice Points</h3>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <textarea
            ref={noticeRef}
            placeholder="Information Needed"
            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none"
          ></textarea>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={sendnotingpint}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Send
            </button>
            <button
              onClick={() => setNotingsBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* notings box end here */}
      {/* reject box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          rejectbox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">
            Are you sure you want to reject?
          </h3>
          <textarea
            ref={rejectRef}
            placeholder="Reject Reason"
            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-2"
          ></textarea>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={() => reject(rejectid)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Reject
            </button>
            <button
              onClick={() => setRejectBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-blue-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* reject box end here */}
      {/* query box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          querybox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">Raise query</h3>

          <textarea
            ref={queryRef}
            placeholder="Information Needed"
            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-4"
          ></textarea>

          <div className="flex-none flex flex-col gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={attachmentRef}
                accept="*/*"
                onChange={(e) => handleLogoChange(e, setAttachment)}
              />
            </div>
            <button
              onClick={() => attachmentRef.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {attachment == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {attachment != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(attachment)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={submitQuery}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Proceed
            </button>
            <button
              onClick={() => setQueryBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* query box end here */}
      {/* forward box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          forwardbox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">
            {nextdata.title}
          </h3>
          <textarea
            ref={forwardRef}
            placeholder="Information Needed"
            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-4"
          ></textarea>
          <div className="flex-none flex flex-col gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={attachmentRef}
                accept="*/*"
                onChange={(e) => handleLogoChange(e, setAttachment)}
              />
            </div>
            <button
              onClick={() => attachmentRef.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {attachment == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {attachment != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(attachment)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={() => forwardQuery(nextdata)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Proceed
            </button>
            <button
              onClick={() => setForwardBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* forward box end here */}
      <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
        <h1 className="text-gray-800 text-2xl font-semibold text-center">
          Roadshow Information
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          SUBJECT : Request for Obtaining Roadshow Information.{" "}
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
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {villagedata.name}
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
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.name}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.2</span> Applicant address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.address}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.3</span> Applicant Contact Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.mobile}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.4</span> Applicant Email
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.email}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.5</span> Applicant Aadhar Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            XXXX-XXXX-{from_data.user_uid}
          </div>
        </div>
        {/*--------------------- section 2 end here ------------------------- */}

        {/*--------------------- section 3 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            3. Event Details{" "}
          </p>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.1</span> Name of the Event
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.event_name}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.2</span> Event address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.event_address}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.3</span> Route Information
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.route_info}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.4</span> Applicant Relation
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.relation}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.5</span> Event From Date
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {new Date(from_data.from_date)
              .toJSON()
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("/")}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.6</span> Event To Date
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {new Date(from_data.to_date)
              .toJSON()
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("/")}
          </div>
        </div>

        {/*--------------------- section 3 end here ------------------------- */}

        {/*--------------------- section 4 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            4. Attachment(s){" "}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.1</span> Document 1 Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.witness_1_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              rel="noreferrer"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.2</span> Document 2 Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.witness_2_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              rel="noreferrer"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.3</span> Applicant Aadhaar Upload
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.applicant_uid_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              rel="noreferrer"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.4</span> Undertaking
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.undertaking_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              rel="noreferrer"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
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
            <p className="text-xl font-normal text-left text-gray-700 pr-2">
              {from_data.iagree}
            </p>
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
            <span className="mr-2">5.2</span> Applicant Signature Image
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.signature_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              rel="noreferrer"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>
        {/*--------------------- section 5 end here ------------------------- */}
        {isSubmited ? (
          user.id == from_data.userId ? (
            common.form_status == 225 ? (
              <Link
                target="_blank"
                to={`/roadshowpdf/${encrypt(
                  `RS-${("0000" + from_data.id).slice(-4)}-${
                    from_data.createdAt.toString().split("-")[0]
                  }`,
                  "certificatedata"
                )}`}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
              >
                Download Roadshow Certificate
              </Link>
            ) : null
          ) : (
            <>
              <div className="flex flex-wrap gap-6 mt-4">
                <Link
                  to={"/home/"}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                >
                  Close
                </Link>
                {common.query_status == "REJECTED" ? null : (
                  <>
                    {user.id == common.auth_user_id ? (
                      <button
                        onClick={() => setQueryBox((val) => true)}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                      >
                        Query
                      </button>
                    ) : null}
                    {user.id == common.auth_user_id ? (
                      <button
                        onClick={() => {
                          setRejectid((val) => common.id);
                          setRejectBox(true);
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                      >
                        Reject
                      </button>
                    ) : null}

                    {/* SUPTD button */}
                    {common.form_status == 1 && user.id == 23 ? (
                      <button
                        onClick={() => {
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Forward to LDC",
                            formstatus: 25,
                            querytype: "INTRA",
                            authuserid: "22",
                            foacaluserid: "21",
                            intrauserid: "21,23",
                            interuserid: "0",
                            touserid: 22,
                            querystatus: "INPROCESS",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to LDC
                      </button>
                    ) : null}
                    {/* LDC button */}
                    {common.form_status == 25 && user.id == 22 ? (
                      <button
                        onClick={() => {
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Forward to SUPTD",
                            formstatus: 50,
                            querytype: "INTRA",
                            authuserid: "21",
                            foacaluserid: "21",
                            intrauserid: "21,22",
                            interuserid: "0",
                            touserid: 21,
                            querystatus: "INPROCESS",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to SUPTD
                      </button>
                    ) : null}

                    {/* SUPTD button */}
                    {common.form_status == 50 && user.id == 21 ? (
                      <button
                        onClick={() => {
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Forward to Dy.Collector",
                            formstatus: 75,
                            querytype: "INTRA",
                            authuserid: "4",
                            foacaluserid: "21",
                            intrauserid: "21,4",
                            interuserid: "0",
                            touserid: 4,
                            querystatus: "INPROCESS",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to Dy.Collector
                      </button>
                    ) : null}

                    {/* Dy.Collector button */}
                    {common.form_status == 75 && user.id == 4 ? (
                      <button
                        onClick={() => {
                          setNotingsBox((val) => true);
                          // setForwardBox(val => true);
                          setNextData((val) => ({
                            title: "Forward to SHO",
                            formstatus: 100,
                            querytype: "INTRA",
                            authuserid: "24",
                            foacaluserid: "21",
                            intrauserid: "21,4,24",
                            interuserid: "0",
                            touserid: 24,
                            querystatus: "INPROCESS",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to SHO
                      </button>
                    ) : null}

                    {/* SHO button */}
                    {common.form_status == 100 && user.id == 24 ? (
                      <button
                        onClick={() => {
                          setNotingsBox((val) => true);
                          // setForwardBox(val => true);
                          setNextData((val) => ({
                            title: "Reply to Dy.Collector",
                            formstatus: 125,
                            querytype: "INTRA",
                            authuserid: "4",
                            foacaluserid: "21",
                            intrauserid: "21,4",
                            interuserid: "0",
                            touserid: 4,
                            querystatus: "INPROCESS",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Reply to Dy.Collector
                      </button>
                    ) : null}

                    {/* Dy.Collector button */}
                    {common.form_status == 125 && user.id == 4 ? (
                      <button
                        onClick={() => {
                          setNotingsBox((val) => true);
                          // setForwardBox(val => true);
                          setNextData((val) => ({
                            title: "Forward to Collector",
                            formstatus: 150,
                            querytype: "INTRA",
                            authuserid: "3",
                            foacaluserid: "21",
                            intrauserid: "21,4,3",
                            interuserid: "0",
                            touserid: 3,
                            querystatus: "INPROCESS",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to Collector
                      </button>
                    ) : null}

                    {/* Collector button */}
                    {common.form_status == 150 && user.id == 3 ? (
                      <button
                        onClick={() => {
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Forward to Dy.Collector",
                            formstatus: 175,
                            querytype: "INTRA",
                            authuserid: "4",
                            foacaluserid: "21",
                            intrauserid: "21,4",
                            interuserid: "0",
                            touserid: 4,
                            querystatus: "INPROCESS",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to Dy.Collector
                      </button>
                    ) : null}

                    {/* Dy.Collector button */}
                    {common.form_status == 175 && user.id == 4 ? (
                      <button
                        onClick={() => {
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Forward to SUPTD",
                            formstatus: 200,
                            querytype: "INTRA",
                            authuserid: "21",
                            foacaluserid: "21",
                            intrauserid: "21,4",
                            interuserid: "0",
                            touserid: 21,
                            querystatus: "INPROCESS",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to SUPTD
                      </button>
                    ) : null}

                    {/* Suptd button */}
                    {common.form_status == 200 && user.id == 21 ? (
                      <button
                        onClick={() => {
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Convey to Applicant",
                            formstatus: 225,
                            querytype: "PUBLIC",
                            authuserid: "0",
                            foacaluserid: "21",
                            intrauserid: "0",
                            interuserid: "0",
                            touserid: from_data.userId,
                            querystatus: "APPROVED",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Convey to Applicant
                      </button>
                    ) : null}
                    {common.form_status == 200 && user.id == 21 ? (
                      <Link
                        to={`/roadshowpdf/${from_data.id}`}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Download Certificate
                      </Link>
                    ) : null}
                  </>
                )}
              </div>
            </>
          )
        ) : user.id == from_data.userId ? (
          <>
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
                Proceed
              </button>
            </div>
          </>
        ) : null}
      </div>
      <div className="p-6 bg-white rounded-lg shadow-lg my-8">
        <h1 className="text-gray-800 text-2xl font-semibold text-center">
          Notings
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        {notings.length == 0 ? (
          <h3 className="text-2xl font-semibold text-center bg-rose-500 bg-opacity-25 rounded-md border-l-4 border-rose-500 py-2  text-rose-500">
            You have not submitted any query.
          </h3>
        ) : (
          <>
            {notings.map((val: any, index: number) => {
              return (
                <div key={index}>
                  <QueryTabs
                    isUser={val.from_user_id == user.id}
                    message={val.remark}
                    date={val.createdAt}
                    doc={val.doc_url}
                    from_user={
                      val.from_user.role == "USER" ? "User" : val.from_user.name
                    }
                    to_user={
                      val.to_user.role == "USER" ? "User" : val.to_user.name
                    }
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default RoadshowView;
