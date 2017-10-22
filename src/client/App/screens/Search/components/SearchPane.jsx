import React from 'react';
import Card from 'grommet/components/Card';
import Tile from 'grommet/components/Tile';

import sw from './assets/sw.jpg';

class SearchTile extends React.Component {
  render() {
    return (
      <Tile>
        <Card
          thumbnail={sw}
          heading={this.props.data.name}
          label={`${this.props.type}`}
          description="Sample description providing more details."
        />
      </Tile>
    );
  }
}

export default SearchTile;
