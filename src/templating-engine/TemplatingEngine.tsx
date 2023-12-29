import React, { CSSProperties } from 'react';
import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CodeBlockObjectResponse,
  DividerBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ImageBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
  ToDoBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { LuClipboardCopy } from 'react-icons/lu';
import { TemplateOptions } from '../../types';

class TemplateEngine {
  async generateJSX(
    blocks: BlockObjectResponse[],
    options: TemplateOptions = { styles: {} }
  ) {
    if (!blocks.length) {
      return <React.Fragment></React.Fragment>;
    }

    const convertedBlocks = await Promise.all(
      blocks.map(async block => {
        const key = `${Date.now()}`;

        switch (block.type) {
          case 'heading_1':
            return this.generateH1(
              block,
              key,
              options.styles.heading_1 as CSSProperties
            );
          case 'heading_2':
            return this.generateH2(
              block,
              key,
              options.styles.heading_2 as CSSProperties
            );
          case 'heading_3':
            return this.generateH3(
              block,
              key,
              options.styles.heading_3 as CSSProperties
            );
          case 'paragraph':
            return this.generateParagraph(
              block,
              key,
              options.styles.paragraph as CSSProperties
            );
          case 'bulleted_list_item':
            return this.generateBulletedListItem(
              block,
              key,
              options.styles.bulleted_list_item as CSSProperties
            );
          case 'numbered_list_item':
            // TODO: Need to fix a bug here, currently it always prints 1. as the number
            return <span></span>;
          // return (
          //   <ol
          //     key={index}
          //     className="list-decimal text-md py-1/2 md:text-justify leading-8 text-neutral-700 max-w-4xl"
          //   >
          //     <li className="list-item">
          //       {this.renderRichText(block.numbered_list_item.rich_text)}
          //     </li>
          //   </ol>
          // );
          case 'quote':
            return this.generateQuote(
              block,
              key,
              options.styles.quote as CSSProperties
            );
          case 'to_do':
            return this.generateTodo(
              block,
              key,
              options.styles.to_do as CSSProperties
            );
          case 'code':
            const codeJSX = await this.generateCode(
              block,
              key,
              options.styles.code as CSSProperties
            );
            return codeJSX;
          case 'divider':
            return this.generateDivider(
              block,
              key,
              options.styles.divider as CSSProperties
            );
          case 'image':
            return this.generateImage(
              block,
              key,
              options.styles.image as CSSProperties
            );
          default:
            // TODO: add support for other types
            // NOTE:  return span instead of React Fragment in case user spreads the classNames prop
            return <span></span>;
        }
      })
    );

    return convertedBlocks;
  }

  private renderRichText(richText: any[]) {
    const parts = richText.map((rt, index) => {
      const { plain_text, annotations, href } = rt;
      const { bold, italic, underline, code, strikethrough } = annotations;

      let style = '';
      if (bold) style += 'font-bold ';
      if (italic) style += 'italic ';
      if (underline) style += 'underline ';
      if (code)
        style +=
          'bg-neutral-100 rounded-sm text-red-400 px-2 text-sm font-mono font-light ';
      if (strikethrough) style += 'line-through	';

      const element = href ? (
        <a
          href={href}
          target="_blank"
          key={index}
          className={`underline transition-colors duration-300 hover:text-blue-500 cursor-pointer ${style.trim()}`}
        >
          {plain_text}
        </a>
      ) : (
        <span key={index} className={style.trim()}>
          {plain_text}
        </span>
      );
      return element;
    });

    return <React.Fragment>{parts}</React.Fragment>;
  }

  private generateH1(
    block: Heading1BlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    return (
      <h1
        key={key}
        style={(styles && { ...styles }) || {}}
        className="text-3xl md:text-4xl text-neutral-900 font-bold py-2"
      >
        {this.renderRichText(block.heading_1.rich_text)}
      </h1>
    );
  }

  private generateH2(
    block: Heading2BlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    return (
      <h2
        key={key}
        style={(styles && { ...styles }) || {}}
        className="text-2xl md:text-3xl text-neutral-900 font-bold py-2"
      >
        {this.renderRichText(block.heading_2.rich_text)}
      </h2>
    );
  }

  private generateH3(
    block: Heading3BlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    return (
      <h3
        key={key}
        style={(styles && { ...styles }) || {}}
        className="text-xl md:text-2xl py-2 font-bold text-neutral-800 max-w-3xl"
      >
        {this.renderRichText(block.heading_3.rich_text)}
      </h3>
    );
  }

  private generateParagraph(
    block: ParagraphBlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    return (
      <p
        key={key}
        style={(styles && { ...styles }) || {}}
        className="text-md max-w-l py-3 md:text-justify leading-8 text-neutral-700 md:max-w-4xl"
      >
        {this.renderRichText(block.paragraph.rich_text)}
      </p>
    );
  }

  private generateBulletedListItem(
    block: BulletedListItemBlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    return (
      <ul
        key={key}
        style={(styles && { ...styles }) || {}}
        className="list-disc text-md py-1/2 md:text-justify leading-8 text-neutral-700 max-w-4xl pl-4"
      >
        <li className="list-item">
          {this.renderRichText(block.bulleted_list_item.rich_text)}
        </li>
      </ul>
    );
  }

  private generateQuote(
    block: QuoteBlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    return (
      <blockquote
        key={key}
        style={(styles && { ...styles }) || {}}
        className="border-l-4 py-3 px-2 my-4 border-neutral-400 md:text-justify leading-8 text-neutral-500 max-w-4xl"
      >
        {this.renderRichText(block.quote.rich_text)}
      </blockquote>
    );
  }

  private generateTodo(
    block: ToDoBlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    return (
      <div
        key={key}
        style={(styles && { ...styles }) || {}}
        className="flex flex-row gap-2 items-center text-neutral-700 my-2"
      >
        {block.to_do.checked ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
        {this.renderRichText(block.to_do.rich_text)}
      </div>
    );
  }

  private async generateCode(
    block: CodeBlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    const copyCodeToClipboard = (data: string) => {
      window.navigator.clipboard.writeText(data);
    };

    // TODO:
    // 1. add easy styles customization for various parts of the codeblock,
    // currently styles can only be added to parent div

    const hljs = (await import(/* webpackChunkName: "hljs" */ 'highlight.js'))
      .default;

    block.code.rich_text = block.code.rich_text.map(rich_text => {
      return {
        ...rich_text,
        plain_text: hljs.highlightAuto(rich_text.plain_text).value,
      };
    });

    return (
      <div
        className=" max-w-xs md:max-w-full bg-neutral-50 px-1 md:px-4 rounded-md"
        style={(styles && { ...styles }) || {}}
      >
        <div className="flex flex-col items-start px-1 py-1 md:px-4 md:py-4 rounded-t-lg">
          <div className="flex flex-row items-center w-full justify-between">
            <div className="text-xs font-semibold text-gray-400">
              {block.code.language}
            </div>
            <button
              className="text-xs font-semibold text-neutral-500 btn-copy hover:text-purple-400 active:text-purple-500"
              onClick={() => {
                copyCodeToClipboard(
                  block.code.rich_text.reduce(
                    (acc, cur) => acc + ' ' + cur.plain_text,
                    ''
                  )
                );
              }}
            >
              <span className="flex flex-row gap-2 mt-2 items-center">
                <LuClipboardCopy className="text-xl" /> Copy
              </span>
            </button>
          </div>
          <div className="overflow-x-auto max-w-full">
            <pre key={key} className="text-sm text-neutral-700">
              <code className="block">
                {this.renderRichText(block.code.rich_text)}
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  private generateDivider(
    block: DividerBlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    return (
      <hr
        key={key}
        style={(styles && { ...styles }) || {}}
        className="max-w-96 border-t border-neutral-200"
      />
    );
  }

  private generateImage(
    block: ImageBlockObjectResponse,
    key: string,
    styles: CSSProperties
  ) {
    if (block.image.type !== 'external') {
      // add support for other kinds of images
      return <React.Fragment></React.Fragment>;
    }

    let alt = '';
    if (block.image.caption && block.image.caption.length > 0) {
      alt = block.image.caption.reduce(
        (acc, cur) => acc + ' ' + cur.plain_text,
        ''
      );
    }

    // TODO:
    // 1. add an api to easily manipulate styles for both div container as well as img tag
    // 2. add support for non external images ?

    return (
      <div
        key={key}
        className="flex items-center justify-center my-2"
        style={(styles && { ...styles }) || {}}
      >
        <img
          src={block.image.external.url}
          alt={alt}
          className="max-w-52 md:max-w-2xl rounded-md"
          loading="lazy"
        />
      </div>
    );
  }
}

export default TemplateEngine;
