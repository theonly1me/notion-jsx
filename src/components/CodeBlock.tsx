import React, { ReactNode, useEffect } from 'react';
import Prism from 'prismjs';

const CodeBlock: React.FC<{
  elementKey: string;
  language: string;
  children: ReactNode;
}> = props => {
  useEffect(() => {
    Prism.highlightAll();
  }, [props.children, props.language, props.elementKey]);

  const default_languages = [
    'javascript',
    'js',
    'html',
    'css',
    'clike',
    'markup',
    'mathml',
    'svg',
    'xml',
  ];

  const language = default_languages.includes(props.language)
    ? props.language
    : 'javascript';

  return (
    <div className="overflow-x-auto w-full">
      <pre className={`language-${language}`} key={props.elementKey}>
        <code className={`language-${language}`}>{props.children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
