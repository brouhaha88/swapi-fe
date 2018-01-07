import React from 'react';
import Card from 'grommet/components/Card';
import Tile from 'grommet/components/Tile';

import sw from './assets/sw.jpg';

class ResourcePane extends React.Component {
  render() {
    const { type, data } = this.props;
    const { url: id, name } = data;

    return (
      <Tile>
        <Card
          thumbnail={sw}
          heading={name}
          label={type}
          description="Sample description providing more details."
          onClick={() => this.props.onClick({
            id,
            type,
          })}
        />
      </Tile>
    );
  }
}

export default ResourcePane;
