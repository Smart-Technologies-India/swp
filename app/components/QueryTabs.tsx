
interface QueryTabsProps {
    isUser: boolean;
    message: string;
    date: string;
    from_user: string;
    to_user: string;
    doc: null | undefined | string;
}

const QueryTabs: React.FC<QueryTabsProps> = (props: QueryTabsProps): JSX.Element => {
    return (
        <div className={`flex ${props.isUser ? "justify-end" : "justify-start"} gap-4 items-center my-4`}>
            <div className={`w-10 h-10 shrink-0 rounded-full text-white font-semibold text-xl ${props.isUser ? "order-2 bg-green-500" : "order-1 bg-cyan-500"} grid place-items-center`}>
                {props.isUser ? props.from_user.toString().slice(0, 1).toUpperCase() : props.to_user.toString().slice(0, 1).toUpperCase()}
            </div>
            <div className={`px-4 py-2 rounded-md ${props.isUser ? "bg-[#e2eaf0] order-1" : "bg-[#dbf4fe] order-2"}`}>
                <div className="flex w-full border-b-2 border-gray-500 pb-2 mb-2">
                    <p className={`text-sm text-gray-700`}>{new Date(props.date).toDateString()} {new Date(props.date).toLocaleTimeString()}</p>
                    <div className="grow w-20"></div>
                    <p className={`text-sm text-gray-700 `}>{props.from_user} to {props.to_user}</p>
                </div>
                <p className={`text-xl text-gray-700`}>{props.message}</p>
                {(props.doc == null || props.doc == undefined || props.doc == "") ? null :
                    <div>
                        <a target="_blank" href={props.doc}
                            className=" py-1 mt-2 inline-block w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                        >
                            View Doc
                        </a>
                    </div>
                }
            </div>
        </div>
    );
}


export default QueryTabs;

