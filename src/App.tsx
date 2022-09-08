import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Editor, { useMonaco } from "@monaco-editor/react";

function App() {

  const monaco = useMonaco();

  const [ editorUri, setEditorUri] = useState<string>();

  const tsProxy = useRef<any>();
  

  useEffect(() => {
    if(!editorUri) return;
    monaco?.languages.typescript.getTypeScriptWorker().then((worker: any) => {
      worker(editorUri).then((proxy: any) => tsProxy.current = proxy);
    })
            

  }, [monaco, editorUri])

  useEffect(() => {
    monaco?.languages.typescript.typescriptDefaults.addExtraLib(`
      export {};
      declare global {
        declare var hello: string;
      }
    `);
  }, [monaco])

  return (
    <>
      <Editor
        language={"typescript"}
        height="90vh"
        onMount={(editor: any) => { setEditorUri(editor.getModel().uri)}}
      
      >
    </Editor>
    <button onClick={() => {
      const a = tsProxy.current.getEmitOutput(editorUri?.toString()).then((result:any) => console.log(JSON.stringify(result.outputFiles[0].text)))
    }} >Compile lol</button>
    </>
    
  );
}

export default App;

