import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'property-information';
import {ReplaceLatex} from "../../../tools/ReplaceLatex";

interface MarkdownPrintProps {
    text: string;
    printed?: boolean;
}

export const RemarkMarkdown = ({ text = '' }: MarkdownPrintProps) => {
    const processedText = ReplaceLatex(text);
    return (
        <div>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {processedText}
            </ReactMarkdown>
        </div>
    );
};