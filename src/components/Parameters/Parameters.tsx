import * as React from 'react';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { ParametersGroup } from './ParametersGroup';

import { UnderlinedHeader } from '../../common-elements';

import { FieldModel, RequestBodyModel } from '../../services/models';
import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';
import { Schema } from '../Schema';

import { MediaContentModel } from '../../services';
import { Markdown } from '../Markdown/Markdown';

function safePush(obj, prop, item) {
  if (!obj[prop]) {
    obj[prop] = [];
  }
  obj[prop].push(item);
}

export interface ParametersProps {
  parameters?: FieldModel[];
  body?: RequestBodyModel;
}

const PARAM_PLACES = ['path', 'query', 'cookie', 'header'];

export class Parameters extends React.PureComponent<ParametersProps> {
  orderParams(params: FieldModel[]): Dict<FieldModel[]> {
    const res = {};
    params.forEach(param => {
      safePush(res, param.in, param);
    });
    return res;
  }

  render() {
    const { body, parameters = [] } = this.props;
    if (body === undefined && parameters === undefined) {
      return null;
    }

    const paramsMap = this.orderParams(parameters);

    const paramsPlaces = parameters.length > 0 ? PARAM_PLACES : [];

    const bodyContent = body && body.content;
    const bodyDescription = body && body.description;

    return (
      <div>
        {paramsPlaces.map(place => (
          <ParametersGroup key={place} place={place} parameters={paramsMap[place]} />
        ))}
        {bodyContent && <BodyContent content={bodyContent} description={bodyDescription} />}
      </div>
    );
  }
}

function DropdownWithinHeader(props) {
  return (
    <UnderlinedHeader key="header">
      Request Body schema: <DropdownOrLabel {...props} />
    </UnderlinedHeader>
  );
}

function BodyContent(props: { content: MediaContentModel, description?: string }): JSX.Element {
  const { content, description } = props;
  return (
    <div>
      {description && <Markdown source={description} />}
      <MediaTypesSwitch content={content} renderDropdown={DropdownWithinHeader}>
        {({ schema }) => {
          return <Schema skipReadOnly={true} key="schema" schema={schema} />;
        }}
      </MediaTypesSwitch>
    </div>
  );
}
