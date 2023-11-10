import { $getRoot, $getSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { SVGProps, useEffect, useLayoutEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import html2canvas from "html2canvas";

import { ThemeProvider } from "@emotion/react";


const theme = {
  // ltr: 'ltr',
  // rtl: 'rtl',
  // paragraph: 'editor-paragraph',
};




import { Fa6SolidHeading, IcBaselineFormatAlignCenter, IcBaselineFormatAlignJustify, IcBaselineFormatAlignLeft, IcBaselineFormatAlignRight, IcBaselineFormatListBulleted, IcBaselineFormatListNumbered, IcBaselineFormatQuote, IcBaselineFormatStrikethrough, IcBaselineFormatUnderlined, IcBaselineImage, IcBaselineInsertLink, IcBaselineSaveAlt, IcBaselineTextFields, IcOutlineCode, MaterialSymbolsEdit, MaterialSymbolsFormatBold, MaterialSymbolsFormatItalic, MaterialSymbolsRedo, MaterialSymbolsUndo } from '~/components/icons/icons';
import useOnClickListener from '~/editor/editorplugin';
import ReactDOMServer, { renderToString } from 'react-dom/server';
// import { useOnClickListener } from '~/editor/editorplugin';

export const eventTypes = {
  paragraph: "paragraph",
  h1: "h1",
  h2: "h2",
  ul: "ul",
  ol: "ol",
  quote: "quote",
  formatCode: "formatCode",
  formatUndo: "formatUndo",
  formatRedo: "formatRedo",
  formatBold: "formatBold",
  formatItalic: "formatItalic",
  formatUnderline: "formatUnderline",
  formatStrike: "formatStrike",
  formatInsertLink: "formatInsertLink",
  formatAlignLeft: "formatAlignLeft",
  formatAlignCenter: "formatAlignCenter",
  formatAlignRight: "formatAlignRight",
  formatAlignJustify: "formatAlignJustify",
  insertImage: "insertImage",
};

type PluginsList = {
  id: number;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  event: string;
}

const pluginsList: PluginsList[] = [
  {
    id: 1,
    Icon: IcBaselineTextFields,
    event: eventTypes.paragraph,
  },
  {
    id: 2,
    Icon: Fa6SolidHeading,
    event: eventTypes.h1,
  },
  {
    id: 3,
    Icon: IcBaselineTextFields,
    event: eventTypes.h2,
  },
  {
    id: 4,
    Icon: IcBaselineFormatListBulleted,
    event: eventTypes.ul,
  },
  {
    id: 5,
    Icon: IcBaselineFormatListNumbered,
    event: eventTypes.ol,
  },
  {
    id: 6,
    Icon: IcBaselineFormatQuote,
    event: eventTypes.quote,
  },

  {
    id: 7,
    Icon: IcOutlineCode,
    event: eventTypes.formatCode,
  },
  {
    id: 8,
    Icon: MaterialSymbolsUndo,
    event: eventTypes.formatUndo,
  },
  {
    id: 9,
    Icon: MaterialSymbolsRedo,
    event: eventTypes.formatRedo,
  },
  {
    id: 10,
    Icon: MaterialSymbolsFormatBold,
    event: eventTypes.formatBold,
  },
  {
    id: 11,
    Icon: MaterialSymbolsFormatItalic,
    event: eventTypes.formatItalic,
  },
  {
    id: 12,
    Icon: IcBaselineFormatUnderlined,
    event: eventTypes.formatUnderline,
  },
  {
    id: 13,
    Icon: IcBaselineFormatStrikethrough,
    event: eventTypes.formatStrike,
  },
  {
    id: 13,
    Icon: IcBaselineImage,
    event: eventTypes.insertImage,
  },
  {
    id: 14,
    Icon: IcBaselineInsertLink,
    event: eventTypes.formatInsertLink,
  },
  {
    id: 15,
    Icon: IcBaselineFormatAlignLeft,
    event: eventTypes.formatAlignLeft,
  },
  {
    id: 16,
    Icon: IcBaselineFormatAlignCenter,
    event: eventTypes.formatAlignCenter,
  },
  {
    id: 17,
    Icon: IcBaselineFormatAlignRight,
    event: eventTypes.formatAlignRight,
  },
  {
    id: 18,
    Icon: IcBaselineFormatAlignJustify,
    event: eventTypes.formatAlignJustify,
  },
];

const ToolBar = () => {

  const [editor] = useLexicalComposerContext();

  return (
    <>
      <div className='flex flex-wrap gap-2 bg-[#eeeeee] py-2'>
        {pluginsList.map((plugins: PluginsList, index: number) => (
          <div
            key={index}
            className='text-xl p-2 text-gray-700 bg-white rounded-md cursor-pointer'
            onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold") }}
          >
            <plugins.Icon />
          </div>
        ))}
      </div>
    </>
  );
}

function Editor() {

  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  };

  return (
    <div className='bg-[#eeeeee] min-h-screen grid place-items-center'>
      <div className='flex flex-col w-5/6'>
        <div className='relative w-full'>
          <LexicalComposer initialConfig={initialConfig}>
            <ToolBar />
            <RichTextPlugin
              contentEditable={<ContentEditable className='bg-white outline-none py-2 px-4 w-full h-96' />}
              placeholder={<div className='absolute top-[3.6rem] left-4 inline-block'>Enter some text...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={onChange} ></OnChangePlugin>
            <HistoryPlugin />
            <MyCustomAutoFocusPlugin />
          </LexicalComposer>
        </div>
        <div className='flex w-full py-2'>
          <div className="grow"></div>
          <div className='flex gap-2 bg-white rounded-md items-center px-4 cursor-pointer'>
            <IcBaselineSaveAlt className='text-lg text-gray-700'></IcBaselineSaveAlt>
            <p className='text-gray-700 text-lg'>SAVE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Editor;


// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: any) {

  editorState.read(() => {

    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

function onError(error: any) {
  console.error(error);
}