'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  value: string | undefined;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  return (
    <div className="bg-background">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};
