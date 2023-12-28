import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export type TemplateOptions = {
  styles: {
    heading_1?: React.CSSProperties;
    heading_2?: React.CSSProperties;
    heading_3?: React.CSSProperties;
    paragraph?: React.CSSProperties;
    bulleted_list_item?: React.CSSProperties;
    quote?: React.CSSProperties;
    to_do?: React.CSSProperties;
    code?: React.CSSProperties;
    divider?: React.CSSProperties;
    image?: React.CSSProperties;
  };
};

export type NotionJSX = {
  generateJSX(
    blocks: BlockObjectResponse[],
    options?: TemplateOptions
  ): JSX.Element[] | JSX.Element;
};
