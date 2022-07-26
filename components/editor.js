import { useEffect, useState, useMemo, useCallback } from "react";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import "easymde/dist/easymde.min.css";

export default function Editor({ value, onChange, options }) {

    const [SimpleMdeReact, setSimpleMdeReact] = useState();

    useEffect(() => {
        setSimpleMdeReact(dynamic(() => import('react-simplemde-editor'), { ssr: false, suspense: true }));
    }, []);

    const editorOptions = useMemo(() => {
        return {
            ...options,
            spellChecker: false,
            direction: "rtl",
        };
    }, []);

    const getCmInstanceCallback = useCallback((editor) => {
        editor.setOption("rtlMoveVisually", true);
    }, []);

    return <Suspense fallback="تحميل...">
        {SimpleMdeReact && <SimpleMdeReact value={value} onChange={onChange} options={editorOptions} getCodemirrorInstance={getCmInstanceCallback} />}

    </Suspense>
}
